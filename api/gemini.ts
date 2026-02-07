import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt não fornecido" }),
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: body.prompt }],
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
