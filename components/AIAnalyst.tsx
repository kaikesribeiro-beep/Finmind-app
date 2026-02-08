import { useState } from "react";

type Transaction = {
  description: string;
  amount: number;
  type: "income" | "expense";
};

export default function AIAnalyst({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const analyze = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      console.error(error);
      alert("Erro ao chamar a IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={analyze} disabled={loading}>
        {loading ? "Analisando..." : "Analisar Agora"}
      </button>

      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultado da Análise</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
