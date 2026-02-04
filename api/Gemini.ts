import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o MOTOR DE INTELIGÊNCIA de um app financeiro (FinMind).
Seu objetivo NÃO é conversar, mas processar dados brutos e retornar análises estruturadas, frias e precisas.

REGRAS DE ANÁLISE:
1. Analise o "healthStatus" baseando-se no saldo e na proporção de gastos vs receitas.
   - POSITIVE: Sobra > 10% da receita.
   - NEUTRAL: Equilibrado ou sobra pouco.
   - RISK: Gastos > Receitas ou tendência perigosa.
2. Identifique padrões comparando o mês atual com o anterior (se disponível).
3. Seja extremamente prático. Ex: "Corte R$ 50 em Lazer" em vez de "Economize mais".
4. Texto deve ser curto, direto e humano (sem "economês").

SAÍDA:
Retorne APENAS o JSON conforme o schema.
`;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const getMonthKey = (dateStr: string) => dateStr.substring(0, 7);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { transactions } = req.body;

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        healthStatus: 'NEUTRAL',
        mainInsight: "Adicione dados para iniciar a análise.",
        monthlyComparison: "Sem dados anteriores.",
        biggestSpender: { category: "N/A", amount: 0, comment: "N/A" },
        alerts: [],
        suggestions: ["Comece registrando seus gastos fixos."],
        projectedBalance: "Aguardando...",
        lastUpdated: Date.now()
      });
    }

    const today = new Date();
    const currentMonthKey = getMonthKey(today.toISOString());

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(today.getMonth() - 1);
    const lastMonthKey = getMonthKey(lastMonthDate.toISOString());

    const currentMonthTrans = transactions.filter((t: any) =>
      t.date.startsWith(currentMonthKey)
    );
    const lastMonthTrans = transactions.filter((t: any) =>
      t.date.startsWith(lastMonthKey)
    );

    const currentExpenses = currentMonthTrans
      .filter((t: any) => t.type === 'expense')
      .reduce((a: number, b: any) => a + b.amount, 0);

    const currentIncome = currentMonthTrans
      .filter((t: any) => t.type === 'income')
      .reduce((a: number, b: any) => a + b.amount, 0);

    const promptData = {
      context: {
        currentDate: today.toISOString().split('T')[0],
        currentMonthSummary: {
          income: currentIncome,
          expenses: currentExpenses,
          balance: currentIncome - currentExpenses
        },
        lastMonthSummary:
          lastMonthTrans.length > 0
            ? "Disponível nos dados brutos"
            : "Sem dados do mês anterior"
      },
      rawTransactionsCurrentMonth: currentMonthTrans,
      rawTransactionsLastMonth: lastMonthTrans
    };

    const prompt = `Analise os dados financeiros abaixo e gere o relatório JSON:\n${JSON.stringify(
      promptData
    )}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthStatus: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "RISK"] },
            mainInsight: { type: Type.STRING },
            monthlyComparison: { type: Type.STRING },
            biggestSpender: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                comment: { type: Type.STRING }
              }
            },
            alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            projectedBalance: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    const result = JSON.parse(text);

    return res.status(200).json({
      ...result,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error("Erro Gemini:", error);
    return res.status(500).json({
      healthStatus: 'NEUTRAL',
      mainInsight: "Sistema de análise temporariamente indisponível.",
      monthlyComparison: "-",
      biggestSpender: { category: "-", amount: 0, comment: "-" },
      alerts: ["Erro interno."],
      suggestions: [],
      projectedBalance: "Indisponível",
      lastUpdated: Date.now()
    });
  }
}
