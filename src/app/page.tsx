import { LojaProvider } from "@/components/loja-contexto";
import { Cabecalho, FaixaDemo } from "@/components/cabecalho";
import { Hero } from "@/components/hero";
import { Categorias, Ofertas, Vantagens } from "@/components/vitrine";
import { Assistencia, Rodape, SecaoLia } from "@/components/secoes";
import { Carrinho } from "@/components/carrinho";
import { ChatLia } from "@/components/chat-lia";

export default function Loja() {
  return (
    <LojaProvider>
      <FaixaDemo />
      <Cabecalho />
      <main className="overflow-x-clip">
        <Hero />
        <Vantagens />
        <Categorias />
        <Ofertas />
        <SecaoLia />
        <Assistencia />
      </main>
      <Rodape />
      <Carrinho />
      <ChatLia />
    </LojaProvider>
  );
}
