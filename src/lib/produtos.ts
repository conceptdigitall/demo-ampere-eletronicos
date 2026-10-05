// Catálogo da loja fictícia. Nomes genéricos de propósito: a demo mostra o sistema, não marcas reais.

export type CategoriaId = "celulares" | "informatica" | "casa" | "assistencia";

export type IconeProduto =
  | "smartphone" | "fone" | "carregador" | "notebook" | "console" | "monitor" | "tv" | "caixa";

export interface Produto {
  id: string;
  nome: string;
  detalhe: string;
  categoria: CategoriaId;
  preco: number;
  precoAntigo?: number;
  selo?: string;
  icone: IconeProduto;
  fundo: string; // gradiente do cartão
}

export const CATEGORIAS: { id: CategoriaId; nome: string; resumo: string }[] = [
  { id: "celulares", nome: "Celulares e acessórios", resumo: "Smartphones, fones, carregadores e capinhas" },
  { id: "informatica", nome: "Informática e games", resumo: "Notebooks, monitores, consoles e periféricos" },
  { id: "casa", nome: "Casa e eletrodomésticos", resumo: "Smart TVs, som e eletroportáteis" },
  { id: "assistencia", nome: "Assistência técnica", resumo: "Troca de tela, bateria e reparos com garantia" },
];

export const PRODUTOS: Produto[] = [
  {
    id: "smartphone-5g", nome: "Smartphone 5G 256 GB", detalhe: "Tela 6,7\" · câmera tripla 50 MP",
    categoria: "celulares", preco: 1899, precoAntigo: 2299, selo: "Mais vendido", icone: "smartphone",
    fundo: "from-sky-500/20 via-indigo-500/10 to-transparent",
  },
  {
    id: "fone-anc", nome: "Fone Bluetooth com cancelamento de ruído", detalhe: "Até 30 h de bateria",
    categoria: "celulares", preco: 349.9, precoAntigo: 449.9, icone: "fone",
    fundo: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: "carregador-33w", nome: "Carregador turbo 33 W + cabo USB-C", detalhe: "Carrega 50% em 25 min",
    categoria: "celulares", preco: 89.9, icone: "carregador",
    fundo: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "notebook-i5", nome: "Notebook 15,6\" Core i5 16 GB", detalhe: "SSD 512 GB · tela Full HD",
    categoria: "informatica", preco: 3499, precoAntigo: 3999, selo: "Oferta", icone: "notebook",
    fundo: "from-slate-400/25 via-slate-500/10 to-transparent",
  },
  {
    id: "console", nome: "Console de nova geração + 2 controles", detalhe: "SSD 1 TB · jogos em 4K",
    categoria: "informatica", preco: 3899, selo: "Lançamento", icone: "console",
    fundo: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    id: "monitor-27", nome: "Monitor gamer 27\" 165 Hz", detalhe: "Painel IPS · 1 ms",
    categoria: "informatica", preco: 1299, precoAntigo: 1499, icone: "monitor",
    fundo: "from-orange-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "tv-55", nome: "Smart TV 55\" 4K com HDR", detalhe: "Wi-Fi, apps e comando de voz",
    categoria: "casa", preco: 2799, precoAntigo: 3299, selo: "Oferta", icone: "tv",
    fundo: "from-cyan-500/20 via-sky-500/10 to-transparent",
  },
  {
    id: "caixa-som", nome: "Caixa de som Bluetooth à prova d'água", detalhe: "20 W · 12 h de bateria",
    categoria: "casa", preco: 399.9, icone: "caixa",
    fundo: "from-rose-500/20 via-red-500/10 to-transparent",
  },
];

export const produtoPorId = (id: string) => PRODUTOS.find((p) => p.id === id);

export const SERVICOS_ASSISTENCIA = [
  { nome: "Troca de tela", prazo: "a partir de 1 h", preco: "a partir de R$ 249" },
  { nome: "Troca de bateria", prazo: "a partir de 40 min", preco: "a partir de R$ 149" },
  { nome: "Conector de carga", prazo: "no mesmo dia", preco: "a partir de R$ 119" },
  { nome: "Limpeza e formatação de notebook", prazo: "em 24 h", preco: "a partir de R$ 129" },
];
