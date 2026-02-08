import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { transactions } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não definida");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Você é um analista financeiro.
Analise as transações abaixo e gere insights claros.

Transações:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      text: result.response.text()
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
