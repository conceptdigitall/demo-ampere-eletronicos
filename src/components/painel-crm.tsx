"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, Bot, ExternalLink, MessageSquare, RotateCcw, ShoppingCart, TrendingUp, Users, Wrench } from "lucide-react";
import { ETAPAS, moverLead, reiniciarDemo, useLeads, type Lead, type Origem } from "@/lib/crm";
import { brl, haQuanto } from "@/lib/formato";
import { Logo } from "./logo";

const ESTILO_ORIGEM: Record<Origem, { classe: string; icone: typeof Bot }> = {
  "Atendente IA": { classe: "bg-violet-100 text-violet-700", icone: Bot },
  "Pedido no site": { classe: "bg-emerald-100 text-emerald-700", icone: ShoppingCart },
  "Assistência técnica": { classe: "bg-amber-100 text-amber-800", icone: Wrench },
};

function CartaoLead({ lead, novo, agora }: { lead: Lead; novo: boolean; agora: number }) {
  const { classe, icone: Icone } = ESTILO_ORIGEM[lead.origem];
  const indice = ETAPAS.findIndex((e) => e.id === lead.etapa);
  const proxima = ETAPAS[indice + 1];
  return (
    <article className={`min-w-0 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-ink-900/5 ${novo ? "animate-chegou" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold">{lead.nome}</p>
        <span className="shrink-0 text-[11px] text-ink-600/70">{haQuanto(lead.criadoEm, agora)}</span>
      </div>
      <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${classe}`}>
        <Icone className="size-3" /> {lead.origem}
      </span>
      <p className="mt-2 text-xs text-ink-700 [overflow-wrap:anywhere]">{lead.interesse}</p>
      {lead.detalhes && lead.detalhes.length > 0 && (
        <ul className="mt-2 space-y-0.5 rounded-lg bg-ink-900/[0.03] p-2 text-[11px] text-ink-600 [overflow-wrap:anywhere]">
          {lead.detalhes.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-bold">{lead.valor ? brl(lead.valor) : "—"}</span>
        {proxima && (
          <button
            onClick={() => moverLead(lead.id, proxima.id)}
            className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-volt-400 hover:text-ink-900"
          >
            {proxima.acao} <ArrowRight className="size-3" />
          </button>
        )}
      </div>
    </article>
  );
}

export function PainelCrm() {
  const leads = useLeads();
  const [agora, setAgora] = useState(() => Date.now());
  const [aviso, setAviso] = useState<Lead | null>(null);
  const vistos = useRef<Set<string> | null>(null);
  const [novos, setNovos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // O que já existia ao abrir o painel não pisca; o que chegar depois entra com destaque e aviso.
  useEffect(() => {
    if (leads.length === 0) return;
    if (!vistos.current) {
      vistos.current = new Set(leads.map((l) => l.id));
      return;
    }
    const chegaram = leads.filter((l) => !vistos.current!.has(l.id));
    if (chegaram.length === 0) return;
    chegaram.forEach((l) => vistos.current!.add(l.id));
    setNovos((atual) => new Set([...atual, ...chegaram.map((l) => l.id)]));
    setAviso(chegaram[0]);
    setAgora(Date.now());
  }, [leads]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 4500);
    return () => clearTimeout(t);
  }, [aviso]);

  const dia = 24 * 60 * 60 * 1000;
  const kpis = [
    { icone: Users, nome: "Leads nas últimas 24 h", valor: String(leads.filter((l) => agora - l.criadoEm < dia).length) },
    { icone: Bot, nome: "Vindos da atendente IA", valor: String(leads.filter((l) => l.origem === "Atendente IA").length) },
    { icone: Wrench, nome: "Orçamentos de assistência", valor: String(leads.filter((l) => l.origem === "Assistência técnica").length) },
    {
      icone: TrendingUp,
      nome: "Em negociação",
      valor: brl(leads.filter((l) => l.etapa !== "venda").reduce((s, l) => s + (l.valor ?? 0), 0)),
    },
  ];
  const conversas = leads.filter((l) => l.origem === "Atendente IA").slice(0, 5);

  return (
    <div className="min-h-dvh bg-[#f3f4f8]">
      <header className="bg-ink-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo claro />
            <span className="hidden text-sm text-white/60 sm:inline">Painel da loja</span>
            <span className="rounded-full bg-volt-400 px-2.5 py-0.5 text-[11px] font-bold text-ink-900">Demonstração</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reiniciarDemo} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/15 hover:bg-white/10">
              <RotateCcw className="size-3.5" /> Reiniciar demo
            </button>
            <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-900">
              Ver a loja <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        {aviso && (
          <div key={aviso.id} className="animate-entrar flex max-w-md items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-2xl ring-1 ring-volt-400/50">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-volt-400"><Bell className="size-4 text-ink-900" /></span>
            <span className="min-w-0">
              <span className="block font-semibold">Novo lead · {aviso.origem}</span>
              <span className="block truncate text-white/70">{aviso.interesse}</span>
            </span>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ icone: Icone, nome, valor }) => (
            <div key={nome} className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5">
              <Icone className="size-5 text-volt-600" />
              <p className="mt-3 truncate font-display text-xl font-bold sm:text-2xl">{valor}</p>
              <p className="text-xs text-ink-600/80">{nome}</p>
            </div>
          ))}
        </section>

        <section>
          <h1 className="font-display text-lg font-bold">Funil de vendas</h1>
          <p className="text-sm text-ink-600/80">Cada pedido, conversa com a Lia ou orçamento entra aqui na hora.</p>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-3">
            {ETAPAS.map((etapa) => {
              const coluna = leads.filter((l) => l.etapa === etapa.id);
              return (
                <div key={etapa.id} className="w-72 shrink-0 rounded-2xl bg-ink-900/[0.04] p-3 lg:w-auto lg:flex-1">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h2 className="text-sm font-semibold">{etapa.nome}</h2>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold ring-1 ring-ink-900/5">{coluna.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {coluna.map((l) => <CartaoLead key={l.id} lead={l} novo={novos.has(l.id)} agora={agora} />)}
                    {coluna.length === 0 && <p className="px-1 py-6 text-center text-xs text-ink-600/60">Nenhum lead aqui</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-900/5">
          <h2 className="flex items-center gap-2 font-display font-bold"><MessageSquare className="size-4 text-volt-600" /> Últimas conversas da Lia</h2>
          {conversas.length === 0 ? (
            <p className="mt-3 text-sm text-ink-600/80">Ainda nenhuma conversa. Abra a loja e fale com a Lia.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink-900/5">
              {conversas.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{l.interesse}</span>
                    <span className="block text-xs text-ink-600/80 [overflow-wrap:anywhere]">{l.detalhes?.[0] ?? l.nome}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-600/70">{haQuanto(l.criadoEm, agora)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
