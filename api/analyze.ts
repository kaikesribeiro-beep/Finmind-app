import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { transactions } = body;

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
Analise as seguintes transações financeiras e gere insights claros e objetivos:
${JSON.stringify(transactions, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na API:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a análise" }),
      { status: 500 }
    );
  }
}
