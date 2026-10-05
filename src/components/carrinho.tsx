"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { produtoPorId } from "@/lib/produtos";
import { brl, parcelas } from "@/lib/formato";
import { adicionarLead } from "@/lib/crm";
import { IconeProduto } from "./icone-produto";
import { useLoja } from "./loja-contexto";

export function Carrinho() {
  const { itens, alterar, limpar, carrinhoAberto, setCarrinhoAberto, avisar } = useLoja();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const linhas = itens.flatMap((i) => {
    const p = produtoPorId(i.id);
    return p ? [{ ...i, p }] : [];
  });
  const total = linhas.reduce((s, l) => s + l.p.preco * l.qtd, 0);

  const finalizar = () => {
    adicionarLead({
      nome: nome.trim() || "Cliente do site",
      contato: whatsapp.trim() || undefined,
      origem: "Pedido no site",
      interesse: linhas.map((l) => (l.qtd > 1 ? `${l.qtd}x ${l.p.nome}` : l.p.nome)).join(" + "),
      valor: total,
      detalhes: linhas.map((l) => `${l.qtd}x ${l.p.nome} · ${brl(l.p.preco * l.qtd)}`),
    });
    limpar();
    setCarrinhoAberto(false);
    avisar("Pedido enviado! Na loja de verdade, o WhatsApp abre com ele pronto. Confira no painel.");
  };

  const campo = "w-full rounded-xl border border-ink-900/10 px-4 py-3 text-sm outline-none focus:border-volt-500 focus:ring-2 focus:ring-volt-400/30";

  return (
    <>
      <div
        onClick={() => setCarrinhoAberto(false)}
        className={`fixed inset-0 z-[65] bg-ink-950/50 backdrop-blur-sm transition ${carrinhoAberto ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
        aria-hidden
      />
      <aside
        aria-label="Carrinho"
        aria-hidden={!carrinhoAberto}
        className={`fixed inset-y-0 right-0 z-[65] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          carrinhoAberto ? "visible translate-x-0" : "pointer-events-none invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-900/5 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold"><ShoppingBag className="size-5" /> Seu carrinho</h2>
          <button onClick={() => setCarrinhoAberto(false)} aria-label="Fechar carrinho" className="grid size-9 place-items-center rounded-full hover:bg-ink-900/5">
            <X className="size-5" />
          </button>
        </div>

        {linhas.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <ShoppingBag className="mx-auto size-12 text-ink-900/20" />
              <p className="mt-3 font-semibold">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm text-ink-600/80">Adicione um produto das ofertas para testar o pedido.</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink-900/5 overflow-y-auto px-5">
              {linhas.map(({ id, qtd, p }) => (
                <li key={id} className="flex items-center gap-3 py-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ink-900/5">
                    <IconeProduto icone={p.icone} className="size-7 text-ink-800" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug">{p.nome}</span>
                    <span className="block text-sm text-ink-600/80">{brl(p.preco)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full border border-ink-900/10">
                    <button onClick={() => alterar(id, -1)} aria-label="Diminuir" className="grid size-8 place-items-center"><Minus className="size-3.5" /></button>
                    <span className="w-5 text-center text-sm font-semibold">{qtd}</span>
                    <button onClick={() => alterar(id, 1)} aria-label="Aumentar" className="grid size-8 place-items-center"><Plus className="size-3.5" /></button>
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-ink-900/5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-end justify-between">
                <span className="text-sm text-ink-600/80">Total</span>
                <span className="text-right">
                  <span className="block font-display text-2xl font-bold">{brl(total)}</span>
                  <span className="block text-xs text-ink-600/80">{parcelas(total)} · {brl(total * 0.95)} no Pix</span>
                </span>
              </div>
              <input className={campo} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
              <input className={campo} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Seu WhatsApp" inputMode="tel" />
              <button onClick={finalizar} className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600">
                Finalizar pedido pelo WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
