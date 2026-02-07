import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🔥 Gemini API chamada");

    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Transações inválidas" });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não definida");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Você é um analista financeiro.
Analise as transações abaixo e gere insights claros, alertas e dicas práticas.

Transações:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("❌ Erro Gemini:", error);
    return res.status(500).json({ error: "Erro ao chamar Gemini" });
  }
}
