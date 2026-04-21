import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#faf8f6] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2a2a2a] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
          404
        </h1>
        <p className="text-2xl text-[#5a7c59] mb-2">Página não encontrada</p>
        <p className="text-[#5a7c59] mb-8">Desculpe, a página que você está procurando não existe.</p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-[#5a7c59] hover:bg-[#4a6c49] text-white"
        >
          Voltar para Loja
        </Button>
      </div>
    </div>
  );
}
