import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AnalysisData } from "../types";

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

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMonthKey = (dateStr: string) => dateStr.substring(0, 7); // YYYY-MM

export const analyzeFinances = async (transactions: Transaction[]): Promise<AnalysisData> => {
  if (transactions.length === 0) {
    return {
      healthStatus: 'NEUTRAL',
      mainInsight: "Adicione dados para iniciar a análise.",
      monthlyComparison: "Sem dados anteriores.",
      biggestSpender: { category: "N/A", amount: 0, comment: "N/A" },
      alerts: [],
      suggestions: ["Comece registrando seus gastos fixos."],
      projectedBalance: "Aguardando...",
      lastUpdated: Date.now()
    };
  }

  // Preparar dados: Mês Atual vs Mês Anterior
  const today = new Date();
  const currentMonthKey = getMonthKey(today.toISOString());
  
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(today.getMonth() - 1);
  const lastMonthKey = getMonthKey(lastMonthDate.toISOString());

  const currentMonthTrans = transactions.filter(t => t.date.startsWith(currentMonthKey));
  const lastMonthTrans = transactions.filter(t => t.date.startsWith(lastMonthKey));

  // Cálculo rápido para contexto do prompt
  const currentExpenses = currentMonthTrans.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const currentIncome = currentMonthTrans.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  
  const promptData = {
    context: {
      currentDate: today.toISOString().split('T')[0],
      currentMonthSummary: {
        income: currentIncome,
        expenses: currentExpenses,
        balance: currentIncome - currentExpenses
      },
      lastMonthSummary: lastMonthTrans.length > 0 ? "Disponível nos dados brutos" : "Sem dados do mês anterior",
    },
    rawTransactionsCurrentMonth: currentMonthTrans,
    rawTransactionsLastMonth: lastMonthTrans
  };

  const prompt = `Analise os dados financeiros abaixo e gere o relatório JSON:\n${JSON.stringify(promptData)}`;

  try {
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
            mainInsight: { type: Type.STRING, description: "Uma frase de impacto sobre o momento financeiro atual." },
            monthlyComparison: { type: Type.STRING, description: "Texto curto comparando performance com mês anterior." },
            biggestSpender: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                comment: { type: Type.STRING, description: "Por que essa categoria impactou o orçamento." }
              }
            },
            alerts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Alertas críticos (ex: saldo negativo projetado, categoria estourada)." 
            },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 ações práticas para melhorar o saldo."
            },
            projectedBalance: { type: Type.STRING, description: "Previsão textual de fim de mês se o ritmo continuar." }
          },
          required: ["healthStatus", "mainInsight", "monthlyComparison", "biggestSpender", "alerts", "suggestions", "projectedBalance"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    
    return {
      ...result,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Erro na análise IA:", error);
    return {
      healthStatus: 'NEUTRAL',
      mainInsight: "Sistema de análise temporariamente indisponível.",
      monthlyComparison: "-",
      biggestSpender: { category: "-", amount: 0, comment: "-" },
      alerts: ["Verifique sua conexão."],
      suggestions: [],
      projectedBalance: "Indisponível",
      lastUpdated: Date.now()
    };
  }
};