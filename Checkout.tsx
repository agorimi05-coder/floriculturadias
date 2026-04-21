import { useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, CreditCard, MapPin, Truck } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Step = "info" | "schedule" | "delivery" | "payment" | "confirmation";
type ScheduleMode = "schedule" | "now";
type DeliveryMode = "delivery" | "pickup";

type PixResponse = {
  qrCode?: string;
  copyAndPaste?: string;
  transactionId?: string;
  amount?: number;
  status?: string;
  expiresAt?: string | null;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<Step>("info");
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("schedule");
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    city: "",
  });
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [orderNumber, setOrderNumber] = useState("");

  const canContinueInfo =
    customerInfo.name.trim() && customerInfo.phone.trim() && customerInfo.email.trim();
  const canContinueSchedule =
    scheduleMode === "now" || (schedule.date.trim() && schedule.time.trim());
  const canContinueDelivery =
    deliveryMode === "pickup" ||
    (address.cep.trim() && address.street.trim() && address.number.trim() && address.city.trim());

  const scheduleSummary = useMemo(() => {
    if (scheduleMode === "now") {
      return "Buscar agora";
    }

    return `${schedule.date} às ${schedule.time}`;
  }, [schedule, scheduleMode]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fcfaf7_0%,#f4efe9_100%)] px-4">
        <Card className="w-full max-w-md rounded-[2rem] border-[#e8d5d0]">
          <CardHeader>
            <CardTitle>Carrinho vazio</CardTitle>
            <CardDescription>Adicione produtos antes de seguir para o checkout.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full bg-[#5a7c59] text-white hover:bg-[#496948]">
              Voltar para a loja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleGeneratePix = async () => {
    setIsGeneratingPix(true);

    try {
      const response = await fetch("/api/pix/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          customer: {
            fullName: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address:
              deliveryMode === "delivery"
                ? {
                    cep: address.cep,
                    street: address.street,
                    number: address.number,
                    city: address.city,
                  }
                : undefined,
          },
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Não foi possível gerar o Pix agora.");
      }

      setPixData(data);
      setOrderNumber(data.transactionId || `FLO-${Date.now()}`);
      setStep("confirmation");
      toast.success("Pix gerado com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao gerar Pix.");
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleNextStep = async () => {
    if (step === "info" && canContinueInfo) {
      setStep("schedule");
      return;
    }

    if (step === "schedule" && canContinueSchedule) {
      setStep("delivery");
      return;
    }

    if (step === "delivery" && canContinueDelivery) {
      setStep("payment");
      return;
    }

    if (step === "payment") {
      await handleGeneratePix();
    }
  };

  const handleFinish = () => {
    clearCart();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(232,213,208,0.45),_transparent_35%),linear-gradient(180deg,#fcfaf7_0%,#f4efe9_100%)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8f6f62]">Checkout</p>
          <h1
            className="text-4xl font-bold text-[#2a2a2a]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Finalize seu pedido
          </h1>
          <p className="mt-2 text-[#5f7a63]">Fluxo ajustado para entrega, retirada e geração de Pix.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_360px]">
          <div>
            <Tabs value={step} onValueChange={(value) => setStep(value as Step)} className="w-full">
              <TabsList className="mb-8 grid h-auto w-full grid-cols-5 rounded-full bg-[#efe1da] p-1">
                <TabsTrigger value="info" className="rounded-full">1</TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-full">2</TabsTrigger>
                <TabsTrigger value="delivery" className="rounded-full">3</TabsTrigger>
                <TabsTrigger value="payment" className="rounded-full">4</TabsTrigger>
                <TabsTrigger value="confirmation" className="rounded-full">5</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <Card className="rounded-[2rem] border-[#e8d5d0]">
                  <CardHeader>
                    <CardTitle>Informações pessoais</CardTitle>
                    <CardDescription>Preencha os dados para preparar o pedido e o Pix.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        placeholder="Ex: João Silva"
                        value={customerInfo.name}
                        onChange={(event) =>
                          setCustomerInfo((current) => ({ ...current, name: event.target.value }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="Ex: (83) 99999-9999"
                        value={customerInfo.phone}
                        onChange={(event) =>
                          setCustomerInfo((current) => ({ ...current, phone: event.target.value }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Ex: cliente@email.com"
                        value={customerInfo.email}
                        onChange={(event) =>
                          setCustomerInfo((current) => ({ ...current, email: event.target.value }))
                        }
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card className="rounded-[2rem] border-[#e8d5d0]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Agendamento
                    </CardTitle>
                    <CardDescription>Escolha entre agendar ou buscar agora. Atendimento até as 22h.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={scheduleMode}
                      onValueChange={(value) => setScheduleMode(value as ScheduleMode)}
                    >
                      <div className="flex items-start space-x-3 rounded-2xl border border-[#e8d5d0] p-4">
                        <RadioGroupItem value="schedule" id="schedule" className="mt-1" />
                        <Label htmlFor="schedule" className="flex-1 cursor-pointer">
                          <span className="block font-semibold text-[#2a2a2a]">Agendamento</span>
                          <span className="text-sm text-[#6f625b]">Defina data e horário para a entrega ou retirada.</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 rounded-2xl border border-[#e8d5d0] p-4">
                        <RadioGroupItem value="now" id="now" className="mt-1" />
                        <Label htmlFor="now" className="flex-1 cursor-pointer">
                          <span className="block font-semibold text-[#2a2a2a]">Buscar agora</span>
                          <span className="text-sm text-[#6f625b]">Fecha a data e o horário e segue direto para o restante do pedido.</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {scheduleMode === "schedule" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="date">Data de entrega</Label>
                          <Input
                            id="date"
                            type="date"
                            value={schedule.date}
                            onChange={(event) =>
                              setSchedule((current) => ({ ...current, date: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Horário</Label>
                          <Input
                            id="time"
                            type="time"
                            value={schedule.time}
                            onChange={(event) =>
                              setSchedule((current) => ({ ...current, time: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery">
                <Card className="rounded-[2rem] border-[#e8d5d0]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Entrega ou retirada
                    </CardTitle>
                    <CardDescription>Escolha como o pedido será recebido.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={deliveryMode}
                      onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}
                    >
                      <div className="flex items-start space-x-3 rounded-2xl border border-[#e8d5d0] p-4">
                        <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <span className="block font-semibold text-[#2a2a2a]">Entrega</span>
                          <span className="text-sm text-[#6f625b]">Informe o endereço completo para receber o pedido.</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 rounded-2xl border border-[#e8d5d0] p-4">
                        <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <span className="block font-semibold text-[#2a2a2a]">Retirada</span>
                          <span className="text-sm text-[#6f625b]">Retire na loja no período escolhido.</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {deliveryMode === "delivery" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            value={address.cep}
                            onChange={(event) =>
                              setAddress((current) => ({ ...current, cep: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            placeholder="João Pessoa"
                            value={address.city}
                            onChange={(event) =>
                              setAddress((current) => ({ ...current, city: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="street">Rua</Label>
                          <Input
                            id="street"
                            placeholder="Rua e complemento principal"
                            value={address.street}
                            onChange={(event) =>
                              setAddress((current) => ({ ...current, street: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="number">Número</Label>
                          <Input
                            id="number"
                            placeholder="Ex: 185"
                            value={address.number}
                            onChange={(event) =>
                              setAddress((current) => ({ ...current, number: event.target.value }))
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card className="rounded-[2rem] border-[#e8d5d0]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Pagamento via Pix
                    </CardTitle>
                    <CardDescription>Revise os dados e gere o Pix para concluir o pedido.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-3xl border border-[#ead8d0] bg-[#f8f1eb] p-5">
                      <p className="text-sm text-[#6f625b]">Total do pedido</p>
                      <p className="mt-1 text-3xl font-bold text-[#c29237]">{formatCurrency(total)}</p>
                    </div>

                    <div className="rounded-3xl border border-dashed border-[#d8c1b8] p-4 text-sm text-[#6f625b]">
                      <p>Cliente: {customerInfo.name}</p>
                      <p>Contato: {customerInfo.phone}</p>
                      <p>E-mail: {customerInfo.email}</p>
                      <p>Recebimento: {deliveryMode === "delivery" ? "Entrega" : "Retirada"}</p>
                      <p>Quando: {scheduleSummary}</p>
                    </div>

                    <Button
                      onClick={handleGeneratePix}
                      disabled={isGeneratingPix}
                      className="h-12 w-full rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]"
                    >
                      {isGeneratingPix ? "Gerando Pix..." : "Gerar Pix"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="confirmation">
                <Card className="rounded-[2rem] border-[#e8d5d0]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#3f7d51]">
                      <CheckCircle2 className="h-5 w-5" />
                      Obrigado pelo seu pedido
                    </CardTitle>
                    <CardDescription>Agora é só concluir o pagamento no Pix para confirmar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-3xl border border-[#dfead7] bg-[#f6fbf4] p-4">
                      <p className="text-sm text-[#4d6a4e]">Número do pedido</p>
                      <p className="text-2xl font-bold text-[#214c2f]">{orderNumber}</p>
                    </div>

                    {pixData?.qrCode && (
                      <div className="rounded-3xl border border-[#ead8d0] bg-white p-4">
                        <img src={pixData.qrCode} alt="QR Code Pix" className="mx-auto max-w-[220px]" />
                      </div>
                    )}

                    {pixData?.copyAndPaste && (
                      <div className="rounded-3xl border border-[#ead8d0] bg-[#fffaf6] p-4">
                        <p className="mb-2 text-sm font-medium text-[#2a2a2a]">Copia e cola Pix</p>
                        <p className="break-all text-sm text-[#6f625b]">{pixData.copyAndPaste}</p>
                      </div>
                    )}

                    <div className="grid gap-3 text-sm text-[#6f625b] md:grid-cols-2">
                      <p>Recebimento: {deliveryMode === "delivery" ? "Entrega" : "Retirada"}</p>
                      <p>Quando: {scheduleSummary}</p>
                      <p>Status: {pixData?.status ?? "Pendente"}</p>
                      <p>Total: {formatCurrency(total)}</p>
                    </div>

                    <Button
                      onClick={handleFinish}
                      className="h-12 w-full rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]"
                    >
                      Voltar para a loja
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "info") {
                    setLocation("/cart");
                    return;
                  }
                  if (step === "schedule") setStep("info");
                  if (step === "delivery") setStep("schedule");
                  if (step === "payment") setStep("delivery");
                  if (step === "confirmation") setStep("payment");
                }}
                className="rounded-full border-[#d8c1b8]"
              >
                Voltar
              </Button>

              {step !== "confirmation" && (
                <Button
                  onClick={handleNextStep}
                  disabled={
                    (step === "info" && !canContinueInfo) ||
                    (step === "schedule" && !canContinueSchedule) ||
                    (step === "delivery" && !canContinueDelivery) ||
                    isGeneratingPix
                  }
                  className="rounded-full bg-[#5a7c59] px-8 text-white hover:bg-[#496948]"
                >
                  {step === "payment" ? "Gerar Pix" : "Próximo"}
                </Button>
              )}
            </div>
          </div>

          <Card className="h-fit rounded-[2rem] border-[#e8d5d0] lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#5a7c59]" />
                Resumo do pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-[#2a2a2a]">{item.product.name}</p>
                      <p className="text-[#6f625b]">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#c29237]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ead8d0] pt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#6f625b]">Subtotal</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-[#2a2a2a]">Total</span>
                  <span className="font-bold text-[#c29237]">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
