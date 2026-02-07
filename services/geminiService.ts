import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeFinances(transactions: any[]) {
  if (!transactions || transactions.length === 0) {
    throw new Error("Nenhuma transação para analisar");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chave Gemini não encontrada");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Você é um analista financeiro.
Analise as transações abaixo e gere insights claros, alertas e dicas práticas.

Transações:
${JSON.stringify(transactions, null, 2)}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
