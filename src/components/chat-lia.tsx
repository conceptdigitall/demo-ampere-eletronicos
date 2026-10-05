"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Plus, ScanSearch, Send, X } from "lucide-react";
import { responder, SUGESTOES, type RaioX } from "@/lib/lia";
import { produtoPorId } from "@/lib/produtos";
import { brl } from "@/lib/formato";
import { adicionarLead } from "@/lib/crm";
import { IconeProduto } from "./icone-produto";
import { useLoja } from "./loja-contexto";

interface Mensagem {
  de: "lia" | "cliente";
  texto: string;
  raioX?: RaioX;
  produtos?: string[];
}

const BOAS_VINDAS: Mensagem = {
  de: "lia",
  texto: "Oi! 👋 Eu sou a Lia, atendente virtual da Ampère. Posso te ajudar a escolher um produto, ver preço e parcelamento ou fazer um orçamento de conserto.",
};

export function ChatLia() {
  const { chatAberto, abrirChat, fecharChat, perguntaPendente, consumirPergunta, adicionar, avisar } = useLoja();
  const [mensagens, setMensagens] = useState<Mensagem[]>([BOAS_VINDAS]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [mostrarRaioX, setMostrarRaioX] = useState(true);
  const fim = useRef<HTMLDivElement>(null);

  const enviar = (pergunta: string) => {
    const limpa = pergunta.trim();
    if (!limpa || digitando) return;
    setMensagens((m) => [...m, { de: "cliente", texto: limpa }]);
    setTexto("");
    setDigitando(true);
    const resposta = responder(limpa);
    setTimeout(() => {
      setDigitando(false);
      setMensagens((m) => [...m, { de: "lia", texto: resposta.texto, raioX: resposta.raioX, produtos: resposta.produtos }]);
      if (resposta.lead) {
        adicionarLead({
          nome: "Cliente via chat",
          origem: "Atendente IA",
          interesse: resposta.lead.interesse,
          valor: resposta.lead.valor,
          detalhes: [`Cliente: “${limpa}”`, `Lia: ${resposta.raioX.intencao}`],
        });
      }
    }, 900 + Math.random() * 600);
  };

  // pergunta vinda de um botão fora do chat (seção "Teste agora")
  useEffect(() => {
    if (chatAberto && perguntaPendente) {
      const p = perguntaPendente;
      consumirPergunta();
      enviar(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatAberto, perguntaPendente]);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensagens, digitando]);

  return (
    <>
      <button
        onClick={() => (chatAberto ? fecharChat() : abrirChat())}
        aria-label={chatAberto ? "Fechar chat" : "Falar com a Lia"}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-[60] flex items-center gap-2 rounded-full bg-ink-900 py-3 pl-3 pr-5 text-sm font-semibold text-white shadow-2xl ring-1 ring-volt-400/40 transition hover:scale-105"
      >
        <span className="relative grid size-9 place-items-center rounded-full bg-volt-400">
          {chatAberto ? <X className="size-5 text-ink-900" /> : <MessageCircle className="size-5 text-ink-900" />}
          {!chatAberto && <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-ink-900 bg-emerald-400" />}
        </span>
        {chatAberto ? "Fechar" : "Fale com a Lia"}
      </button>

      <section
        aria-label="Chat com a Lia"
        aria-hidden={!chatAberto}
        className={`fixed inset-x-3 bottom-24 z-[60] flex h-[min(620px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink-900/10 transition sm:inset-x-auto sm:right-5 sm:w-[390px] ${
          chatAberto ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-4 opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 bg-ink-900 px-4 py-3 text-white">
          <span className="relative grid size-10 place-items-center rounded-full bg-gradient-to-br from-volt-300 to-volt-500 font-display font-bold text-ink-900">
            L
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-ink-900 bg-emerald-400" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Lia · Ampère</span>
            <span className="block text-xs text-emerald-300">online agora · atendente virtual</span>
          </span>
          <button
            onClick={() => setMostrarRaioX(!mostrarRaioX)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${mostrarRaioX ? "bg-volt-400 text-ink-900" : "bg-white/10 text-white/70"}`}
            title="Mostra o que a IA entendeu e o que ela fez no CRM"
          >
            <ScanSearch className="size-3.5" /> Raio-X
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#efeae2] px-3 py-4">
          {mensagens.map((m, i) => (
            <div key={i} className={`animate-entrar flex ${m.de === "cliente" ? "justify-end" : "justify-start"}`}>
              <div className="min-w-0 max-w-[85%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm [overflow-wrap:anywhere] ${
                    m.de === "cliente" ? "rounded-br-sm bg-[#d9fdd3] text-ink-900" : "rounded-bl-sm bg-white text-ink-900"
                  }`}
                >
                  {m.texto}
                </div>
                {m.produtos?.map((id) => {
                  const p = produtoPorId(id);
                  if (!p) return null;
                  return (
                    <div key={id} className="mt-2 flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink-900/5">
                        <IconeProduto icone={p.icone} className="size-6 text-ink-800" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold">{p.nome}</span>
                        <span className="block text-xs text-ink-600/80">{brl(p.preco)}</span>
                      </span>
                      <button
                        onClick={() => {
                          adicionar(p.id);
                          avisar(`${p.nome} foi para o carrinho`);
                        }}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Plus className="size-3" /> Carrinho
                      </button>
                    </div>
                  );
                })}
                {m.raioX && mostrarRaioX && (
                  <div className="mt-2 rounded-xl bg-ink-900 px-3 py-2 text-[11px] leading-relaxed text-white/80">
                    <p className="flex items-center gap-1 font-semibold text-volt-400"><Bot className="size-3" /> Raio-X da IA</p>
                    <p><span className="text-white/50">Intenção:</span> {m.raioX.intencao}</p>
                    <p><span className="text-white/50">No CRM:</span> {m.raioX.acao}</p>
                    <p><span className="text-white/50">Respondeu em:</span> {m.raioX.tempo}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {digitando && (
            <div className="flex">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm" aria-label="Lia está digitando">
                {[0, 1, 2].map((n) => (
                  <span key={n} className="size-2 animate-digitando rounded-full bg-ink-600" style={{ animationDelay: `${n * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={fim} />
        </div>

        {mensagens.length < 4 && (
          <div className="flex gap-2 overflow-x-auto border-t border-ink-900/5 bg-white px-3 py-2">
            {SUGESTOES.map((s) => (
              <button key={s} onClick={() => enviar(s)} className="shrink-0 rounded-full border border-ink-900/10 px-3 py-1.5 text-xs font-medium hover:border-volt-500 hover:bg-volt-400/10">
                {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
          className="flex items-center gap-2 border-t border-ink-900/5 bg-white p-3"
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva sua pergunta..."
            className="min-w-0 flex-1 rounded-full bg-ink-900/5 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-volt-400/40"
          />
          <button type="submit" aria-label="Enviar" disabled={!texto.trim() || digitando} className="grid size-10 shrink-0 place-items-center rounded-full bg-volt-400 text-ink-900 transition disabled:opacity-40">
            <Send className="size-4" />
          </button>
        </form>
      </section>
    </>
  );
}
