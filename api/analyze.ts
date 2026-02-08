import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Força a Vercel a usar Node.js (necessário para o SDK do Gemini)
 */
export const config = {
  runtime: "nodejs",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { transactions } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ error: "Transactions inválidas" }),
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Você é um analista financeiro.

Analise as transações abaixo e gere:
- insights claros
- riscos financeiros
- oportunidades de economia
- sugestões práticas

Transações:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return new Response(
      JSON.stringify({ text }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro na API:", error);

    return new Response(
      JSON.stringify({ error: "Erro ao processar a análise" }),
      { status: 500 }
    );
  }
}
