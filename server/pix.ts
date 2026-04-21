type CheckoutCustomer = {
  fullName?: string;
  email?: string | null;
  phone?: string;
  document?: string;
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    complement?: string;
    city?: string;
    state?: string;
  };
};

type CheckoutItem = {
  id?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
};

type PixCheckoutInput = {
  amount: number;
  customer?: CheckoutCustomer;
  items?: CheckoutItem[];
};

type PixWebhookInput = {
  event?: string;
  transactionId?: string;
  status?: string;
  raw?: unknown;
};

function toCents(value: number) {
  return Math.round(Number(value) * 100);
}

function fromCents(value?: number) {
  if (typeof value !== "number") return undefined;
  return value / 100;
}

function normalizeDigits(value?: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

function normalizeString(value?: string | null) {
  return (value ?? "").trim();
}

function normalizeEmail(value?: string | null) {
  return normalizeString(value).toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryStatus(status: number) {
  return status === 500 || status === 502 || status === 503 || status === 504;
}

function getBaseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function getBlackcatApiBase() {
  return (
    process.env.BLACKCAT_API_BASE_URL ??
    process.env.PIX_API_URL ??
    "https://api.blackcatpay.com.br/api"
  ).replace(/\/$/, "");
}

function getApiKey() {
  return process.env.BLACKCAT_API_KEY ?? process.env.PIX_API_KEY ?? "";
}

function inferDocumentType(document: string) {
  return document.length > 11 ? "cnpj" : "cpf";
}

function getFallbackDocument() {
  return normalizeDigits(
    process.env.BLACKCAT_DEFAULT_DOCUMENT ??
      process.env.PIX_DEFAULT_DOCUMENT ??
      "",
  );
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeBlackcatSaleResponse(payload: any, fallbackAmount: number) {
  const data = payload?.data ?? payload ?? {};
  const paymentData = data?.paymentData ?? {};
  const rawQrCodeImage =
    paymentData?.qrCodeBase64 ??
    paymentData?.qrCodeBase64Image ??
    paymentData?.qr_code_base64 ??
    paymentData?.qrCodeImage ??
    paymentData?.qr_code_image ??
    "";

  const qrCode =
    typeof rawQrCodeImage === "string" && rawQrCodeImage.startsWith("data:image")
      ? rawQrCodeImage
      : rawQrCodeImage
        ? `data:image/png;base64,${rawQrCodeImage}`
        : "";

  return {
    qrCode,
    copyAndPaste: paymentData?.copyPaste ?? paymentData?.qrCode ?? "",
    transactionId: data?.transactionId ?? "",
    amount: fromCents(data?.amount) ?? fallbackAmount,
    status: data?.status ?? payload?.status ?? "PENDING",
    expiresAt: paymentData?.expiresAt ?? data?.expiresAt ?? null,
    invoiceUrl: data?.invoiceUrl ?? null,
    paidAt: data?.paidAt ?? null,
  };
}

export async function createPixCharge(input: PixCheckoutInput) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      status: 500,
      body: { message: "Configure a BLACKCAT_API_KEY na Vercel ou no .env.local." },
    };
  }

  const parsedAmount = Number(input.amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return {
      status: 400,
      body: { message: "Valor total inválido para gerar o Pix." },
    };
  }

  const customer = input.customer ?? {};
  const address = customer.address ?? {};

  const fullName = normalizeString(customer.fullName);
  const email = normalizeEmail(customer.email);
  const phone = normalizeDigits(customer.phone);
  const document = normalizeDigits(customer.document) || getFallbackDocument();

  const cep = normalizeString(address.cep) || "00000-000";
  const street = normalizeString(address.street) || "Rua nao informada";
  const number = normalizeString(address.number) || "S/N";
  const neighborhood = normalizeString(address.neighborhood) || "Centro";
  const complement = normalizeString(address.complement) || "Sem complemento";
  const city = normalizeString(address.city) || "Cidade nao informada";
  const state = normalizeString(address.state).toUpperCase() || "PB";

  if (!fullName || !email || !phone) {
    return {
      status: 400,
      body: { message: "Nome, e-mail e telefone são obrigatórios para gerar o Pix." },
    };
  }

  if (!isValidEmail(email)) {
    return {
      status: 400,
      body: { message: "E-mail inválido para gerar o Pix." },
    };
  }

  if (!document) {
    return {
      status: 500,
      body: {
        message:
          "Configure a BLACKCAT_DEFAULT_DOCUMENT na Vercel para gerar o Pix sem pedir CPF no checkout.",
      },
    };
  }

  const items = (input.items ?? []).map((item) => ({
    title: normalizeString(item.name) || "Produto",
    quantity: Number(item.quantity ?? 1),
    unitPrice: toCents(Number(item.unitPrice ?? 0)),
    tangible: false,
  }));

  if (items.length === 0 || items.some((item) => item.unitPrice <= 0)) {
    return {
      status: 400,
      body: { message: "Envie ao menos um item válido para criar a venda." },
    };
  }

  const body = {
    amount: toCents(parsedAmount),
    currency: "BRL",
    paymentMethod: "pix",
    items,
    customer: {
      name: fullName,
      email,
      phone,
      document: {
        number: document,
        type: inferDocumentType(document),
      },
      address: {
        zipCode: cep,
        street,
        number,
        neighborhood,
        complement,
        city,
        state,
        country: "BR",
      },
    },
    pix: {
      expiresInDays: 1,
    },
    postbackUrl: `${getBaseUrl()}/api/pix/webhook`,
    externalRef: `pedido-${Date.now()}`,
    metadata: "Compra via floricultura crys artes",
  };

  const requestSale = async () => {
    const response = await fetch(`${getBlackcatApiBase()}/sales/create-sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();
    const payload = safeJsonParse(rawText) ?? {};

    return { response, payload, rawText };
  };

  let attempt = await requestSale();

  if (shouldRetryStatus(attempt.response.status)) {
    await wait(1200);
    attempt = await requestSale();
  }

  if (!attempt.response.ok || attempt.payload?.success === false) {
    return {
      status: attempt.response.ok ? 400 : attempt.response.status,
      body: {
        message:
          attempt.payload?.message ??
          attempt.payload?.error ??
          "A BlackCatPay retornou um erro ao gerar a cobrança Pix.",
        details:
          attempt.payload && Object.keys(attempt.payload).length > 0
            ? attempt.payload
            : attempt.rawText,
      },
    };
  }

  const normalized = normalizeBlackcatSaleResponse(attempt.payload, parsedAmount);

  return {
    status: 200,
    body: normalized,
  };
}

export async function getPixStatus(transactionId?: string | null) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      status: 500,
      body: { message: "Configure a BLACKCAT_API_KEY na Vercel ou no .env.local." },
    };
  }

  if (!transactionId?.trim()) {
    return {
      status: 400,
      body: { message: "Informe o transactionId para consultar o Pix." },
    };
  }

  const response = await fetch(
    `${getBlackcatApiBase()}/sales/${encodeURIComponent(transactionId)}/status`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );

  const rawText = await response.text();
  const payload = safeJsonParse(rawText) ?? {};

  if (!response.ok || payload?.success === false) {
    return {
      status: response.ok ? 400 : response.status,
      body: {
        message:
          payload?.message ??
          payload?.error ??
          "A BlackCatPay retornou um erro ao consultar o status.",
        details:
          payload && Object.keys(payload).length > 0 ? payload : rawText,
      },
    };
  }

  return {
    status: 200,
    body: normalizeBlackcatSaleResponse(payload, 0),
  };
}

export async function receivePixWebhook(input: PixWebhookInput) {
  const webhookSecret =
    process.env.BLACKCAT_WEBHOOK_SECRET ?? process.env.PIX_WEBHOOK_SECRET;

  if (webhookSecret && input?.raw && typeof input.raw === "object") {
    const providedSecret =
      (input.raw as Record<string, unknown>)["secret"] ??
      (input.raw as Record<string, unknown>)["token"];

    if (providedSecret !== webhookSecret) {
      return {
        status: 401,
        body: { message: "Webhook Pix não autorizado." },
      };
    }
  }

  return {
    status: 200,
    body: {
      received: true,
      event: input.event ?? "unknown",
      transactionId: input.transactionId ?? null,
      status: input.status ?? "received",
    },
  };
}
