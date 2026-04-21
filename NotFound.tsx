import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f5f3f0] to-[#faf8f6] px-4">
      <div className="text-center">
        <h1
          className="mb-4 text-6xl font-bold text-[#2a2a2a]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          404
        </h1>
        <p className="mb-2 text-2xl text-[#5a7c59]">Página não encontrada</p>
        <p className="mb-8 text-[#5a7c59]">Desculpe, a página que você está procurando não existe.</p>
        <Button onClick={() => setLocation("/")} className="bg-[#5a7c59] text-white hover:bg-[#4a6c49]">
          Voltar para Loja
        </Button>
      </div>
    </div>
  );
}
