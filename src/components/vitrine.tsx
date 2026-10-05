"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CreditCard, Gamepad2, Home, Plus, ShieldCheck, Smartphone, Truck, Wrench, type LucideIcon } from "lucide-react";
import { CATEGORIAS, PRODUTOS, type CategoriaId, type Produto } from "@/lib/produtos";
import { brl, parcelas } from "@/lib/formato";
import { IconeProduto } from "./icone-produto";
import { useLoja } from "./loja-contexto";

const EVENTO_CATEGORIA = "ampere:categoria";

export function Vantagens() {
  const itens: { icone: LucideIcon; titulo: string; texto: string }[] = [
    { icone: Truck, titulo: "Entrega no mesmo dia", texto: "Pedidos até as 15h na cidade" },
    { icone: CreditCard, titulo: "12x sem juros", texto: "E 5% de desconto no Pix" },
    { icone: ShieldCheck, titulo: "Garantia e nota fiscal", texto: "Em todos os produtos" },
    { icone: Wrench, titulo: "Assistência própria", texto: "Bancada técnica na loja" },
  ];
  return (
    <section className="border-b border-ink-900/5 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {itens.map(({ icone: Icone, titulo, texto }) => (
          <div key={titulo} className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-volt-400/15">
              <Icone className="size-5 text-volt-600" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{titulo}</span>
              <span className="block text-xs text-ink-600/80">{texto}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

const ICONE_CATEGORIA: Record<CategoriaId, LucideIcon> = {
  celulares: Smartphone,
  informatica: Gamepad2,
  casa: Home,
  assistencia: Wrench,
};

export function Categorias() {
  const escolher = (id: CategoriaId) => {
    if (id === "assistencia") return document.getElementById("assistencia")?.scrollIntoView();
    window.dispatchEvent(new CustomEvent(EVENTO_CATEGORIA, { detail: id }));
    document.getElementById("ofertas")?.scrollIntoView();
  };
  return (
    <section id="categorias" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Compre por categoria</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {CATEGORIAS.map((c) => {
          const Icone = ICONE_CATEGORIA[c.id];
          return (
            <button
              key={c.id}
              onClick={() => escolher(c.id)}
              className="group flex min-w-0 flex-col items-start rounded-2xl border border-ink-900/5 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-volt-500/40 hover:shadow-lg sm:p-5"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-ink-900 transition group-hover:bg-volt-400">
                <Icone className="size-5 text-volt-400 transition group-hover:text-ink-900" />
              </span>
              <span className="mt-4 text-sm font-semibold sm:text-base">{c.nome}</span>
              <span className="mt-1 text-xs text-ink-600/80 sm:text-sm">{c.resumo}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-volt-600">
                Ver <ArrowRight className="size-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CartaoProduto({ p }: { p: Produto }) {
  const { adicionar, avisar } = useLoja();
  const desconto = p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white transition hover:shadow-xl">
      <div className={`relative grid h-44 place-items-center bg-gradient-to-br ${p.fundo} bg-ink-900/[0.03]`}>
        {p.selo && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-volt-400">{p.selo}</span>
        )}
        {desconto > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">-{desconto}%</span>
        )}
        <IconeProduto icone={p.icone} className="size-20 text-ink-800 transition duration-300 group-hover:scale-110" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug sm:text-base">{p.nome}</h3>
        <p className="mt-1 text-xs text-ink-600/80">{p.detalhe}</p>
        <div className="mt-auto pt-4">
          {p.precoAntigo && <p className="text-xs text-ink-600/60 line-through">{brl(p.precoAntigo)}</p>}
          <p className="font-display text-xl font-bold">{brl(p.preco)}</p>
          <p className="text-xs text-ink-600/80">{parcelas(p.preco)}</p>
          <button
            onClick={() => {
              adicionar(p.id);
              avisar(`${p.nome} foi para o carrinho`);
            }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink-900 py-2.5 text-sm font-semibold text-white transition hover:bg-volt-400 hover:text-ink-900"
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}

export function Ofertas() {
  const [filtro, setFiltro] = useState<CategoriaId | "todas">("todas");

  useEffect(() => {
    const ouvir = (e: Event) => setFiltro((e as CustomEvent<CategoriaId>).detail);
    window.addEventListener(EVENTO_CATEGORIA, ouvir);
    return () => window.removeEventListener(EVENTO_CATEGORIA, ouvir);
  }, []);

  const abas: { id: CategoriaId | "todas"; nome: string }[] = [
    { id: "todas", nome: "Todas" },
    ...CATEGORIAS.filter((c) => c.id !== "assistencia").map((c) => ({ id: c.id, nome: c.nome.split(" e ")[0] })),
  ];
  const lista = PRODUTOS.filter((p) => filtro === "todas" || p.categoria === filtro);

  return (
    <section id="ofertas" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-volt-600">Ofertas da semana</p>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Preço de loja, atendimento de perto</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setFiltro(a.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filtro === a.id ? "bg-ink-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-900/10 hover:ring-ink-900/30"
              }`}
            >
              {a.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {lista.map((p) => (
          <CartaoProduto key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
