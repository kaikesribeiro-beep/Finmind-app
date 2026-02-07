import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function handler(req: Request) {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();

    if (!body.transactions || !Array.isArray(body.transactions)) {
      return new Response(
        JSON.stringify({ error: "Transações não fornecidas" }),
        { status: 400 }
      );
    }

    const prompt = `
Analise as seguintes transações financeiras e gere insights claros e objetivos,
incluindo dicas de economia e possíveis problemas financeiros.

Transações:
${JSON.stringify(body.transactions, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return new Response(
      JSON.stringify({ result: response.text }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro Gemini:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao chamar Gemini" }),
      { status: 500 }
    );
  }
}
