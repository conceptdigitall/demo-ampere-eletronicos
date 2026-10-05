// "Lia", a atendente de IA simulada: reconhece a intenção por palavras-chave e responde com roteiro.
// Numa venda de verdade isto vira um modelo de linguagem ligado ao WhatsApp; na demo, nunca falha na call.

import { brl, parcelas } from "./formato";
import { produtoPorId } from "./produtos";

export interface RaioX {
  intencao: string;
  acao: string;
  tempo: string;
}

export interface RespostaLia {
  texto: string;
  produtos?: string[];
  raioX: RaioX;
  lead?: { interesse: string; valor?: number };
}

export const SUGESTOES = [
  "Tem celular 5G até R$ 2.000?",
  "Quanto custa trocar a tela do celular?",
  "Quero um notebook para trabalhar",
  "Vocês parcelam?",
  "Qual o horário de vocês?",
];

const preco = (id: string) => produtoPorId(id)?.preco ?? 0;
const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

type Montagem = Omit<RespostaLia, "raioX"> & { intencao: string; acao: string };

// A ordem importa: "trocar a tela do celular" é assistência, não venda de celular.
const REGRAS: { chaves: RegExp; montar: (msg: string) => Montagem }[] = [
  {
    chaves: /tela|quebr|trinc|bateria|consert|arrum|assistencia|nao liga|conector|molhou|reparo|defeito/,
    montar: () => ({
      texto: "Consigo te ajudar com isso! 🔧 A troca de tela fica a partir de R$ 249 e a de bateria a partir de R$ 149, com 90 dias de garantia. Me conta o modelo do aparelho que eu já te passo o valor exato e reservo um horário na bancada.",
      intencao: "Orçamento de assistência técnica",
      acao: "Lead criado em “Novos leads” · etiqueta Assistência",
      lead: { interesse: "Orçamento: troca de tela / bateria" },
    }),
  },
  {
    chaves: /celular|smartphone|iphone|android|5g|galaxy|xiaomi|motorola/,
    montar: () => ({
      texto: `Temos sim! 📱 O Smartphone 5G 256 GB está em oferta: ${brl(preco("smartphone-5g"))} à vista ou ${parcelas(preco("smartphone-5g"))}. Quer que eu separe um pra você retirar hoje ou prefere receber em casa?`,
      produtos: ["smartphone-5g"],
      intencao: "Compra · smartphone",
      acao: `Lead criado · interesse: smartphone 5G · ${brl(preco("smartphone-5g"))}`,
      lead: { interesse: "Smartphone 5G", valor: preco("smartphone-5g") },
    }),
  },
  {
    chaves: /notebook|computador|\bpc\b|game|gamer|console|videogame|monitor|jogo|trabalh|estud/,
    montar: () => ({
      texto: `Boa! 💻 Hoje o destaque é o Notebook Core i5 16 GB por ${brl(preco("notebook-i5"))} e, pra quem joga, o console com 2 controles por ${brl(preco("console"))}. Os dois em até 12x sem juros. É pra trabalho, estudo ou jogos? Assim te indico o ideal.`,
      produtos: ["notebook-i5", "console"],
      intencao: "Compra · informática e games",
      acao: `Lead criado · interesse: notebook / console · ${brl(preco("notebook-i5"))}`,
      lead: { interesse: "Notebook / console", valor: preco("notebook-i5") },
    }),
  },
  {
    chaves: /\btv\b|televis|\bsom\b|caixa|smart tv|eletrodom|air ?fryer|micro-?ondas|ventilador/,
    montar: () => ({
      texto: `Temos! 📺 A Smart TV 55" 4K saiu de R$ 3.299 por ${brl(preco("tv-55"))} e a caixa de som Bluetooth está por ${brl(preco("caixa-som"))}. Quer que eu veja a entrega pro seu CEP?`,
      produtos: ["tv-55", "caixa-som"],
      intencao: "Compra · casa e eletrodomésticos",
      acao: `Lead criado · interesse: Smart TV · ${brl(preco("tv-55"))}`,
      lead: { interesse: "Smart TV / som", valor: preco("tv-55") },
    }),
  },
  {
    chaves: /parcel|juros|pix|cartao|pagamento|pagar|boleto|desconto/,
    montar: () => ({
      texto: "Parcelamos em até 12x sem juros no cartão 💳 e no Pix você ganha 5% de desconto. Quer que eu calcule o valor de algum produto?",
      intencao: "Dúvida · formas de pagamento",
      acao: "Dúvida respondida · nenhum lead criado",
    }),
  },
  {
    chaves: /horario|aberto|abre|fecha|funciona|endereco|onde fica|localiza|loja fisica/,
    montar: () => ({
      texto: "Estamos na Av. das Tecnologias, 1200, Centro 📍, de segunda a sábado, das 9h às 19h. Aqui no chat eu atendo 24 horas, todos os dias!",
      intencao: "Dúvida · horário e endereço",
      acao: "Dúvida respondida · nenhum lead criado",
    }),
  },
  {
    chaves: /entreg|frete|envio|recebo|chega/,
    montar: () => ({
      texto: "Entregamos no mesmo dia na cidade para pedidos até as 15h 🚚, e para todo o Brasil pelos Correios. Me passa seu CEP que eu calculo o frete.",
      intencao: "Dúvida · entrega e frete",
      acao: "Dúvida respondida · nenhum lead criado",
    }),
  },
  {
    chaves: /^(oi|ola|bom dia|boa tarde|boa noite|e ai|opa|hey)\b/,
    montar: () => ({
      texto: "Oi! 👋 Eu sou a Lia, atendente virtual da Ampère. Posso te ajudar a escolher um produto, ver preço e parcelamento ou fazer um orçamento de conserto. O que você procura hoje?",
      intencao: "Saudação",
      acao: "Conversa iniciada · aguardando interesse",
    }),
  },
];

export function responder(mensagem: string): RespostaLia {
  const texto = normalizar(mensagem.trim());
  const regra = REGRAS.find((r) => r.chaves.test(texto));
  const m: Montagem = regra
    ? regra.montar(mensagem)
    : {
        texto: "Boa pergunta! Pra te responder certinho vou chamar um dos nossos vendedores 🙋‍♀️. Ele continua com você aqui mesmo em instantes.",
        intencao: "Não identificada",
        acao: "Transferido para vendedor humano · lead criado",
        lead: { interesse: `Pergunta: “${mensagem.trim().slice(0, 60)}”` },
      };
  const segundos = (0.8 + Math.random() * 0.9).toFixed(1).replace(".", ",");
  const { intencao, acao, ...resto } = m;
  return { ...resto, raioX: { intencao, acao, tempo: `${segundos} s` } };
}
