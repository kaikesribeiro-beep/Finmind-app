import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(req.body.prompt);
    const response = await result.response.text();

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: "Erro ao chamar Gemini" });
  }
}
