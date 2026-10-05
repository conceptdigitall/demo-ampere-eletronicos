# Demo Ampère Eletrônicos

Demonstração de venda da Concept Digital para lojas de eletrônicos: loja online, atendente de IA ("Lia") e CRM integrado.
A marca é fictícia; tudo roda no navegador, sem banco nem chaves.

## Como usar na call

1. Abra a loja (`/`) numa janela e o painel da loja (`/painel`) em outra, lado a lado.
2. Na loja, faça qualquer uma destas ações:
   - pergunte algo para a Lia (botão "Fale com a Lia" ou as perguntas prontas na seção "Atendimento 24h");
   - adicione produtos ao carrinho e finalize o pedido;
   - peça um orçamento na seção "Assistência técnica".
3. O lead aparece na hora no funil do painel, com origem, interesse e valor. Os botões dos cards avançam o lead no funil.
4. "Reiniciar demo" no painel volta aos dados iniciais.

## O que é simulado

- **Lia:** respostas roteirizadas por intenção (preço, assistência, parcelamento, horário, entrega). No produto real, vira um modelo de linguagem ligado ao WhatsApp da loja.
- **CRM:** guardado no `localStorage` do navegador e sincronizado entre abas com `BroadcastChannel`. No produto real, é o CRM Concept.

## Rodar

```bash
npm install
npm run dev
```
