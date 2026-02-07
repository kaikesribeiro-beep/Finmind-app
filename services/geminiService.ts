import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeFinances(transactions: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analise as seguintes transações financeiras e gere insights:
${JSON.stringify(transactions)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
