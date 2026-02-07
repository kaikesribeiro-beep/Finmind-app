import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.transactions || !Array.isArray(body.transactions)) {
      return new Response(
        JSON.stringify({ error: "Transações não fornecidas" }),
        { status: 400 }
      );
    }

    const prompt = `
Você é um analista financeiro.
Analise as seguintes transações e gere insights claros e objetivos,
com dicas de economia e alertas financeiros.

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
      JSON.stringify({
        result: response.text,
      }),
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
