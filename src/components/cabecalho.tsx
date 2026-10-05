"use client";

import { useState } from "react";
import { ExternalLink, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { Logo } from "./logo";
import { useLoja } from "./loja-contexto";

const LINKS = [
  { href: "#ofertas", nome: "Ofertas" },
  { href: "#categorias", nome: "Categorias" },
  { href: "#assistencia", nome: "Assistência" },
  { href: "#atendimento", nome: "Atendimento 24h" },
];

export function FaixaDemo() {
  return (
    <div className="bg-volt-400 px-4 py-2 text-center text-xs font-medium text-ink-900 sm:text-sm">
      <span className="font-semibold">Demonstração Concept Digital</span>
      <span className="hidden sm:inline"> · loja, atendente de IA e CRM de exemplo</span>
      {" · "}
      <a href="/painel" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
        Abrir o painel da loja <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

export function Cabecalho() {
  const { itens, setCarrinhoAberto, abrirChat } = useLoja();
  const [menu, setMenu] = useState(false);
  const total = itens.reduce((s, i) => s + i.qtd, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#topo" aria-label="Ampère Eletrônicos, início">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-700 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-ink-900">
              {l.nome}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => abrirChat()}
            className="hidden items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700 sm:flex"
          >
            <MessageCircle className="size-4 text-volt-400" /> Falar com a Lia
          </button>
          <button
            onClick={() => setCarrinhoAberto(true)}
            aria-label={`Carrinho com ${total} itens`}
            className="relative grid size-10 place-items-center rounded-full border border-ink-900/10 bg-white transition hover:border-ink-900/30"
          >
            <ShoppingBag className="size-5" />
            {total > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-volt-400 text-[11px] font-bold text-ink-900">
                {total}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            className="grid size-10 place-items-center rounded-full border border-ink-900/10 md:hidden"
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <nav
        className={`border-t border-ink-900/5 bg-white px-4 py-3 md:hidden ${menu ? "block" : "hidden"}`}
        aria-hidden={!menu}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-3 font-medium text-ink-800 hover:bg-ink-900/5">
            {l.nome}
          </a>
        ))}
      </nav>
    </header>
  );
}
