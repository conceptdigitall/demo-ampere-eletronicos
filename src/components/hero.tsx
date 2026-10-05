"use client";

import { ArrowRight, Bot, CreditCard, MessageCircle, ShieldCheck, Smartphone, Sparkles, Truck, UserPlus } from "lucide-react";
import { useLoja } from "./loja-contexto";
import { brl, parcelas } from "@/lib/formato";

export function Hero() {
  const { abrirChat } = useLoja();
  return (
    <section id="topo" className="relative overflow-hidden bg-ink-900 text-white">
      <div className="grade-eletrica absolute inset-0" aria-hidden />
      <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-volt-400/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-sky-500/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-volt-400/30 bg-volt-400/10 px-3 py-1 text-xs font-semibold text-volt-300">
            <Sparkles className="size-3.5" /> Atendente de IA respondendo 24 horas
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Tecnologia com <span className="text-volt-400">atendimento</span> de verdade.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Celulares, informática, games e casa com preço justo, e uma assistência técnica que resolve. Tirou a dúvida
            com a Lia, ela separa o seu produto na hora.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#ofertas"
              className="inline-flex items-center gap-2 rounded-full bg-volt-400 px-6 py-3 text-sm font-bold text-ink-900 transition hover:bg-volt-300 sm:text-base"
            >
              Ver ofertas da semana <ArrowRight className="size-4" />
            </a>
            <button
              onClick={() => abrirChat()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 sm:text-base"
            >
              <MessageCircle className="size-4 text-volt-400" /> Falar com a Lia
            </button>
          </div>
          <ul className="mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm text-white/70 sm:grid-cols-3">
            <li className="flex items-center gap-2"><CreditCard className="size-4 text-volt-400" /> 12x sem juros</li>
            <li className="flex items-center gap-2"><Truck className="size-4 text-volt-400" /> Entrega no mesmo dia</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-volt-400" /> Garantia e nota</li>
          </ul>
        </div>

        {/* vitrine: produto + conversa com a Lia + lead chegando no CRM, a venda inteira numa imagem */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
          <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-volt-400 px-3 py-1 text-xs font-bold text-ink-900">Mais vendido</span>
              <span className="text-xs text-white/50">-17%</span>
            </div>
            <div className="grid h-56 place-items-center sm:h-64">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-volt-400/25 blur-2xl" />
                <Smartphone className="relative size-36 text-white sm:size-44" strokeWidth={1} />
              </div>
            </div>
            <p className="font-display text-lg font-semibold">Smartphone 5G 256 GB</p>
            <p className="mt-1 text-sm text-white/50 line-through">{brl(2299)}</p>
            <p className="font-display text-3xl font-bold text-volt-400">{brl(1899)}</p>
            <p className="text-sm text-white/60">{parcelas(1899)}</p>
          </div>

          <div className="absolute -left-4 top-10 hidden w-60 rounded-2xl rounded-bl-sm bg-white p-3 text-sm text-ink-900 shadow-2xl sm:block lg:-left-12">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><Bot className="size-3.5" /> Lia · agora</p>
            <p className="mt-1">Tenho sim! Quer que eu separe um pra você retirar hoje? 📱</p>
          </div>
          <div className="absolute -bottom-5 left-3 flex items-center gap-2 rounded-2xl bg-ink-800 px-4 py-3 text-sm shadow-2xl ring-1 ring-volt-400/40 lg:-left-10">
            <span className="grid size-8 place-items-center rounded-full bg-volt-400/15"><UserPlus className="size-4 text-volt-400" /></span>
            <span>
              <span className="block text-xs text-white/50">CRM da loja</span>
              <span className="font-semibold">Novo lead: smartphone 5G</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
