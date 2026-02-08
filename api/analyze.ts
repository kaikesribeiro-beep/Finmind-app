import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key não configurada" });
  }

  try {
    const { transactions } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analise estas transações financeiras e gere insights em português:\n${JSON.stringify(
                    transactions,
                    null,
                    2
                  )}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (err) {
    res.status(500).json({ error: "Erro ao chamar Gemini" });
  }
}
