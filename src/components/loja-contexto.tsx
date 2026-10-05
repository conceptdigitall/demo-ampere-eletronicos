"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export interface ItemCarrinho {
  id: string;
  qtd: number;
}

interface LojaCtx {
  itens: ItemCarrinho[];
  adicionar: (id: string) => void;
  alterar: (id: string, delta: number) => void;
  limpar: () => void;
  carrinhoAberto: boolean;
  setCarrinhoAberto: (v: boolean) => void;
  chatAberto: boolean;
  abrirChat: (pergunta?: string) => void;
  fecharChat: () => void;
  perguntaPendente: string | null;
  consumirPergunta: () => void;
  avisar: (texto: string) => void;
}

const Ctx = createContext<LojaCtx | null>(null);

export function useLoja() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoja fora do LojaProvider");
  return ctx;
}

export function LojaProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [perguntaPendente, setPerguntaPendente] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ texto: string; n: number } | null>(null);

  const avisar = useCallback((texto: string) => setAviso({ texto, n: Date.now() }), []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3800);
    return () => clearTimeout(t);
  }, [aviso]);

  const valor = useMemo<LojaCtx>(
    () => ({
      itens,
      adicionar: (id) =>
        setItens((atual) =>
          atual.some((i) => i.id === id)
            ? atual.map((i) => (i.id === id ? { ...i, qtd: i.qtd + 1 } : i))
            : [...atual, { id, qtd: 1 }],
        ),
      alterar: (id, delta) =>
        setItens((atual) =>
          atual.map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i)).filter((i) => i.qtd > 0),
        ),
      limpar: () => setItens([]),
      carrinhoAberto,
      // carrinho e chat nunca abertos juntos: um cobriria o outro
      setCarrinhoAberto: (v) => {
        setCarrinhoAberto(v);
        if (v) setChatAberto(false);
      },
      chatAberto,
      abrirChat: (pergunta) => {
        setCarrinhoAberto(false);
        setChatAberto(true);
        if (pergunta) setPerguntaPendente(pergunta);
      },
      fecharChat: () => setChatAberto(false),
      perguntaPendente,
      consumirPergunta: () => setPerguntaPendente(null),
      avisar,
    }),
    [itens, carrinhoAberto, chatAberto, perguntaPendente, avisar],
  );

  return (
    <Ctx.Provider value={valor}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-[70] flex justify-center px-4">
        {aviso && (
          <div key={aviso.n} className="animate-entrar flex max-w-md items-center gap-2 rounded-xl bg-ink-900 px-4 py-3 text-sm text-white shadow-2xl ring-1 ring-white/10">
            <CheckCircle2 className="size-5 shrink-0 text-volt-400" />
            <span className="min-w-0">{aviso.texto}</span>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
