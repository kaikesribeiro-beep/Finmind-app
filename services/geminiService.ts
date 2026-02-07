export async function analyzeFinances(transactions: any[]) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactions }),
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar análise IA");
  }

  return await response.json();
}
