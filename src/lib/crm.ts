"use client";

// CRM de demonstração: vive no navegador (localStorage) e avisa as outras abas na hora (BroadcastChannel).
// Assim a loja e o /painel, abertos lado a lado, mostram o lead chegando sem backend nenhum.

import { useEffect, useState } from "react";

export type Etapa = "novo" | "atendimento" | "proposta" | "venda";
export type Origem = "Pedido no site" | "Atendente IA" | "Assistência técnica";

export interface Lead {
  id: string;
  nome: string;
  contato?: string;
  origem: Origem;
  interesse: string;
  valor?: number;
  etapa: Etapa;
  criadoEm: number;
  detalhes?: string[];
}

// `acao` é o rótulo do botão que leva o lead PARA esta etapa.
export const ETAPAS: { id: Etapa; nome: string; acao: string }[] = [
  { id: "novo", nome: "Novos leads", acao: "Novo" },
  { id: "atendimento", nome: "Em atendimento", acao: "Atender" },
  { id: "proposta", nome: "Proposta enviada", acao: "Enviar proposta" },
  { id: "venda", nome: "Venda fechada", acao: "Fechar venda" },
];

const CHAVE = "ampere-demo-leads-v1";
const CANAL = "ampere-demo";

function semente(): Lead[] {
  const agora = Date.now();
  const min = 60000;
  return [
    { id: "s1", nome: "Mariana Costa", contato: "(11) 9 8123-4410", origem: "Atendente IA", interesse: "Smart TV 55\" 4K", valor: 2799, etapa: "proposta", criadoEm: agora - 190 * min },
    { id: "s2", nome: "Rafael Souza", contato: "(11) 9 7781-0032", origem: "Assistência técnica", interesse: "Troca de tela · celular", valor: 349, etapa: "atendimento", criadoEm: agora - 75 * min },
    { id: "s3", nome: "Juliana Alves", contato: "(11) 9 9450-2217", origem: "Pedido no site", interesse: "Fone Bluetooth com cancelamento de ruído", valor: 349.9, etapa: "venda", criadoEm: agora - 300 * min },
    { id: "s4", nome: "Carlos Mendes", origem: "Atendente IA", interesse: "Notebook para trabalho até R$ 4.000", valor: 3499, etapa: "atendimento", criadoEm: agora - 42 * min },
    { id: "s5", nome: "Beatriz Lima", contato: "(11) 9 8302-7765", origem: "Pedido no site", interesse: "Console + 2 controles", valor: 3899, etapa: "novo", criadoEm: agora - 18 * min },
  ];
}

export function lerLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = window.localStorage.getItem(CHAVE);
    if (salvo) return JSON.parse(salvo) as Lead[];
  } catch {
    // navegador sem storage (aba anônima restrita): segue só com a semente
  }
  const inicial = semente();
  gravar(inicial);
  return inicial;
}

function gravar(leads: Lead[]) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(leads));
  } catch {
    // sem storage: a demo funciona na aba atual
  }
  try {
    const canal = new BroadcastChannel(CANAL);
    canal.postMessage("mudou");
    canal.close();
  } catch {
    // navegador sem BroadcastChannel: o evento "storage" cobre as outras abas
  }
  window.dispatchEvent(new Event(CANAL));
}

export function adicionarLead(dados: Omit<Lead, "id" | "etapa" | "criadoEm">): Lead {
  const lead: Lead = { ...dados, id: Math.random().toString(36).slice(2, 9), etapa: "novo", criadoEm: Date.now() };
  gravar([lead, ...lerLeads()]);
  return lead;
}

export function moverLead(id: string, etapa: Etapa) {
  gravar(lerLeads().map((l) => (l.id === id ? { ...l, etapa } : l)));
}

export function reiniciarDemo() {
  gravar(semente());
}

/** Leads atuais, atualizados quando qualquer aba muda o CRM. */
export function useLeads(): Lead[] {
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => {
    const atualizar = () => setLeads(lerLeads());
    atualizar();
    let canal: BroadcastChannel | null = null;
    try {
      canal = new BroadcastChannel(CANAL);
      canal.onmessage = atualizar;
    } catch {
      canal = null;
    }
    const noStorage = (e: StorageEvent) => e.key === CHAVE && atualizar();
    window.addEventListener("storage", noStorage);
    window.addEventListener(CANAL, atualizar);
    return () => {
      canal?.close();
      window.removeEventListener("storage", noStorage);
      window.removeEventListener(CANAL, atualizar);
    };
  }, []);
  return leads;
}
