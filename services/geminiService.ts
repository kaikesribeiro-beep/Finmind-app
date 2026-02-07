export async function analyzeFinances(transactions: any[]) {
  const prompt = `
Você é um assistente financeiro.
Analise as transações abaixo e forneça:
- Resumo geral
- Pontos de atenção
- Sugestões de melhoria financeira

Transações:
${transactions
  .map(
    (t) =>
      `• ${t.date || "data desconhecida"} - ${t.description || "sem descrição"}: R$ ${t.amount}`
  )
  .join("\n")}
`;

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt, // 
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar análise IA");
  }

  const data = await response.json();
  return data.result;
}
