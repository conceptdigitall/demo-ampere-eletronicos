export const brl = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const parcelas = (valor: number, vezes = 12) => `${vezes}x de ${brl(valor / vezes)} sem juros`;

export function haQuanto(momento: number, agora = Date.now()): string {
  const min = Math.max(0, Math.round((agora - momento) / 60000));
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} d`;
}
