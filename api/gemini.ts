import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Transações inválidas" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Você é um analista financeiro.
Analise as seguintes transações e gere insights claros, alertas e dicas práticas.

Transações:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return res.status(200).json({ result: response });
  } catch (error) {
    console.error("Erro Gemini:", error);
    return res.status(500).json({ error: "Erro ao chamar Gemini" });
  }
}
