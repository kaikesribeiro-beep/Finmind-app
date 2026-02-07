import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY não definida");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeFinances(transactions: any[]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro"
  });

  const prompt = `
Analise as seguintes transações financeiras e gere insights claros.
Responda em português.

Transações:
${JSON.stringify(transactions, null, 2)}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
}
