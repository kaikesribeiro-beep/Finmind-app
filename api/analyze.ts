import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Aceita apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { transactions } = req.body;

    if (!transactions) {
      return res.status(400).json({ error: "Transactions not provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não definida nas variáveis de ambiente");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Você é um analista financeiro experiente.

Analise as transações abaixo, identifique:
- padrões de gastos
- possíveis excessos
- oportunidades de economia
- um resumo final claro

Transações:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);

    return res.status(200).json({
      text: result.response.text(),
    });

  } catch (error: any) {
    console.error("Erro na API /api/analyze:", error);

    return res.status(500).json({
      error: "Erro ao gerar análise",
      details: error.message,
    });
  }
}
