import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Cart() {
  const { items, total, removeItem, updateQuantity } = useCart();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfaf7_0%,#f4efe9_100%)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8f6f62]">Carrinho</p>
            <h1
              className="text-4xl font-bold text-[#2a2a2a]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Revise seu pedido
            </h1>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")} className="rounded-full border-[#d8c1b8]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Adicionar mais
          </Button>
        </div>

        {items.length === 0 ? (
          <Card className="rounded-[2rem] border-[#e8d5d0]">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="mb-4 h-12 w-12 text-[#c9a961]" />
              <h2 className="text-2xl font-semibold text-[#2a2a2a]">Seu carrinho está vazio</h2>
              <p className="mt-2 max-w-md text-sm text-[#6f625b]">
                Volte para a loja e adicione os produtos que quiser antes de seguir para o checkout.
              </p>
              <Button onClick={() => setLocation("/")} className="mt-6 rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]">
                Ir para a loja
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.product.id} className="rounded-[2rem] border-[#e8d5d0]">
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-28 w-28 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f6f62]">
                        {item.product.category}
                      </p>
                      <h3 className="text-lg font-semibold text-[#2a2a2a]">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-[#6f625b]">{item.product.description}</p>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end">
                      <p className="text-lg font-bold text-[#c29237]">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.product.id, Math.max(1, Number(event.target.value) || 1))
                          }
                          className="w-20 border-[#decac3] text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="border-[#decac3]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit rounded-[2rem] border-[#e8d5d0] lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-[#6f625b]">
                  <div className="flex justify-between">
                    <span>Itens</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-[#2a2a2a]">
                    <span>Total</span>
                    <span className="text-[#c29237]">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation("/checkout")}
                  className="h-12 w-full rounded-full bg-[#5a7c59] text-white hover:bg-[#496948]"
                >
                  Ir para checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
