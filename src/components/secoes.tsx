"use client";

import { useState } from "react";
import { Bot, Clock, MapPin, MessageCircle, Phone, Send, Sparkles, UserPlus, Wrench, Zap } from "lucide-react";
import { SERVICOS_ASSISTENCIA } from "@/lib/produtos";
import { SUGESTOES } from "@/lib/lia";
import { adicionarLead } from "@/lib/crm";
import { useLoja } from "./loja-contexto";
import { Logo } from "./logo";

export function SecaoLia() {
  const { abrirChat } = useLoja();
  const passos = [
    { icone: MessageCircle, titulo: "O cliente pergunta", texto: "No site ou no WhatsApp, a qualquer hora." },
    { icone: Sparkles, titulo: "A Lia entende e responde", texto: "Preço, estoque, parcelamento, orçamento de conserto." },
    { icone: UserPlus, titulo: "O lead cai no CRM", texto: "Com o interesse anotado, pronto pro vendedor fechar." },
  ];
  return (
    <section id="atendimento" className="scroll-mt-20 bg-ink-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-volt-300">
            <Bot className="size-3.5" /> Atendente virtual
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A Lia atende enquanto a loja está fechada.
          </h2>
          <p className="mt-4 text-white/70">
            Ela tira dúvida, indica o produto certo e já deixa o cliente anotado para a equipe. Ninguém fica sem
            resposta, nem domingo à noite.
          </p>
          <ol className="mt-8 space-y-5">
            {passos.map(({ icone: Icone, titulo, texto }, i) => (
              <li key={titulo} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-volt-400 font-display font-bold text-ink-900">{i + 1}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-semibold"><Icone className="size-4 text-volt-400" /> {titulo}</span>
                  <span className="text-sm text-white/60">{texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="min-w-0 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <p className="text-sm font-semibold text-white/80">Teste agora, toque numa pergunta:</p>
          <div className="mt-4 flex flex-col gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                onClick={() => abrirChat(s)}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-left text-sm ring-1 ring-white/10 transition hover:bg-volt-400 hover:text-ink-900"
              >
                <span className="min-w-0">{s}</span>
                <Send className="size-4 shrink-0" />
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">
            Abra o painel da loja (link na faixa amarela) em outra janela para ver cada conversa virar lead.
          </p>
        </div>
      </div>
    </section>
  );
}

const APARELHOS = ["Celular", "Notebook", "Tablet", "Console", "Outro"];
const PROBLEMAS = ["Tela quebrada", "Bateria viciada", "Não carrega", "Não liga", "Caiu na água", "Outro"];

export function Assistencia() {
  const { avisar } = useLoja();
  const [form, setForm] = useState({ aparelho: "Celular", problema: "Tela quebrada", nome: "", whatsapp: "" });
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarLead({
      nome: form.nome.trim() || "Cliente do site",
      contato: form.whatsapp.trim() || undefined,
      origem: "Assistência técnica",
      interesse: `${form.problema} · ${form.aparelho.toLowerCase()}`,
      detalhes: [`Aparelho: ${form.aparelho}`, `Problema: ${form.problema}`],
    });
    setEnviado(true);
    avisar("Orçamento enviado! Ele já apareceu no painel da loja.");
  };

  const campo = "w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-volt-500 focus:ring-2 focus:ring-volt-400/30";

  return (
    <section id="assistencia" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-volt-600">Assistência técnica</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Quebrou? A gente conserta, com garantia.</h2>
          <p className="mt-4 text-ink-700">Bancada própria, peças de qualidade e 90 dias de garantia no serviço.</p>
          <ul className="mt-8 divide-y divide-ink-900/5 rounded-2xl border border-ink-900/5 bg-white">
            {SERVICOS_ASSISTENCIA.map((s) => (
              <li key={s.nome} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="flex min-w-0 items-center gap-3">
                  <Wrench className="size-4 shrink-0 text-volt-600" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{s.nome}</span>
                    <span className="block text-xs text-ink-600/80">{s.prazo}</span>
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold">{s.preco}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={enviar} className="min-w-0 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-ink-900/5 sm:p-8">
          <h3 className="font-display text-xl font-bold">Peça seu orçamento</h3>
          <p className="mt-1 text-sm text-ink-600/80">Respondemos pelo WhatsApp em poucos minutos.</p>
          {enviado ? (
            <div className="animate-entrar mt-6 rounded-2xl bg-emerald-50 p-6 text-center">
              <p className="font-semibold text-emerald-700">Recebemos seu pedido de orçamento!</p>
              <p className="mt-1 text-sm text-emerald-700/80">Na loja de verdade, ele chega no WhatsApp e no CRM da equipe na hora.</p>
              <button type="button" onClick={() => setEnviado(false)} className="mt-4 text-sm font-semibold text-emerald-700 underline">
                Fazer outro orçamento
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Aparelho
                <select className={`${campo} mt-1.5`} value={form.aparelho} onChange={(e) => setForm({ ...form, aparelho: e.target.value })}>
                  {APARELHOS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Problema
                <select className={`${campo} mt-1.5`} value={form.problema} onChange={(e) => setForm({ ...form, problema: e.target.value })}>
                  {PROBLEMAS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Seu nome
                <input className={`${campo} mt-1.5`} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Como podemos te chamar?" />
              </label>
              <label className="text-sm font-medium">
                WhatsApp
                <input className={`${campo} mt-1.5`} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(00) 0 0000-0000" inputMode="tel" />
              </label>
              <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-volt-400 py-3 text-sm font-bold text-ink-900 transition hover:bg-volt-300 sm:col-span-2">
                <Send className="size-4" /> Pedir orçamento
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="bg-ink-950 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-4 text-sm">Tecnologia com atendimento de verdade. Loja fictícia para demonstração.</p>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2"><MapPin className="size-4 text-volt-400" /> Av. das Tecnologias, 1200, Centro</li>
          <li className="flex items-center gap-2"><Clock className="size-4 text-volt-400" /> Seg a sáb, 9h às 19h · chat 24h</li>
          <li className="flex items-center gap-2"><Phone className="size-4 text-volt-400" /> (00) 0 0000-0000</li>
        </ul>
        <div className="text-sm md:text-right">
          <p className="flex items-center gap-2 md:justify-end">
            <Zap className="size-4 text-volt-400" /> Site, atendente de IA e CRM:
          </p>
          <p className="mt-1 font-semibold text-white">Concept Digital</p>
        </div>
      </div>
    </footer>
  );
}
