import { useMemo, useState } from "react";
import { products, categories } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Store, Truck, Clock3 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { addItem, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      if (!normalizedSearch) {
        return matchesCategory;
      }

      const haystack = normalizeText(
        `${product.name} ${product.description} ${product.category}`,
      );

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho.`);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(232,213,208,0.45),_transparent_38%),linear-gradient(180deg,#fcfaf7_0%,#f4efe9_100%)] text-[#2f2a27]">
      <header className="sticky top-0 z-50 border-b border-[#e8d5d0] bg-[#fffaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8f6f62]">
              Floricultura em João Pessoa
            </p>
            <h1
              className="text-2xl font-bold text-[#2a2a2a] md:text-3xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Floricultura Crys Artes
            </h1>
            <p className="text-sm text-[#5f7a63]">Presentes delicados para todo tipo de ocasião</p>
          </div>

          <Button
            onClick={() => setLocation("/cart")}
            className="relative bg-[#5a7c59] text-white hover:bg-[#496948]"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrinho
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a961] text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#ead8d0]">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/hero-flowers-arrangement-B7HQEL3dXch4TfsfBxmzLH.webp"
          alt="Arranjos florais da Floricultura Crys Artes"
          className="h-[360px] w-full object-cover md:h-[460px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,20,16,0.72)_0%,rgba(26,20,16,0.3)_55%,rgba(26,20,16,0.12)_100%)]" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-4">
          <div className="max-w-2xl text-white">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-[#f0dbc8]">
              Loja aberta até as 22h
            </p>
            <h2
              className="mb-4 text-4xl font-bold leading-tight md:text-6xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Beleza em cada pétala, entrega com carinho.
            </h2>
            <p className="max-w-xl text-base text-white/90 md:text-lg">
              Escolha buquês, caixas especiais e mimos com uma experiência de compra simples,
              rápida e pensada para converter.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setLocation("/cart")}
                className="bg-[#5a7c59] text-white hover:bg-[#496948]"
              >
                Ver carrinho
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("Linha Premium")}
                className="border-white/60 bg-white/10 text-white hover:bg-white/20"
              >
                Ver destaques
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[#ead8d0] bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[#5a7c59]">
            <Store className="h-4 w-4" />
            <span className="text-sm font-semibold">Sem pedido mínimo</span>
          </div>
          <p className="text-sm text-[#6f625b]">Monte o pedido no seu ritmo e finalize só quando quiser.</p>
        </div>
        <div className="rounded-3xl border border-[#ead8d0] bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[#5a7c59]">
            <Truck className="h-4 w-4" />
            <span className="text-sm font-semibold">Entrega ou retirada</span>
          </div>
          <p className="text-sm text-[#6f625b]">Preencha o endereço completo no checkout ou escolha retirada.</p>
        </div>
        <div className="rounded-3xl border border-[#ead8d0] bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[#5a7c59]">
            <Clock3 className="h-4 w-4" />
            <span className="text-sm font-semibold">Atendimento até 22h</span>
          </div>
          <p className="text-sm text-[#6f625b]">Agende a entrega ou escolha a opção buscar agora no checkout.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 rounded-[2rem] border border-[#ead8d0] bg-white/90 p-4 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#8f6f62]">Catálogo</p>
              <h3
                className="text-3xl font-bold text-[#2a2a2a]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Escolha o presente ideal
              </h3>
            </div>
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a7c59]" />
              <Input
                placeholder="Buscar flores, caixas, mimos..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-12 rounded-full border-[#e8d5d0] bg-[#fffdfb] pl-11"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null
                  ? "rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]"
                  : "rounded-full border-[#decac3] text-[#6f625b]"
              }
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]"
                    : "rounded-full border-[#decac3] text-[#6f625b]"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden rounded-[2rem] border-[#e7d7d0] bg-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-[#f5f0ea]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <CardContent className="flex min-h-[220px] flex-col p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f6f62]">
                  {product.category}
                </p>
                <h4 className="min-h-[3.25rem] text-base font-semibold leading-tight text-[#2d2622] md:text-lg">
                  {product.name}
                </h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6f625b] line-clamp-3">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-[#c29237] md:text-xl">
                    {formatCurrency(product.price)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="rounded-full bg-[#5a7c59] px-4 text-white hover:bg-[#496948]"
                  >
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-[#d8c1b8] bg-white/70 px-6 py-12 text-center">
            <p className="text-lg font-medium text-[#5f7a63]">Nenhum produto encontrado.</p>
            <p className="mt-2 text-sm text-[#7d6d65]">
              Tente outro termo de busca ou escolha uma categoria diferente.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
