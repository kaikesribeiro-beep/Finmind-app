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
  const [result, setResult] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      console.error(error);
      setResult("Erro ao gerar análise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <button onClick={analyze} disabled={loading}>
        {loading ? "Analisando..." : "Analisar Agora"}
      </button>

      {/* RESULTADO */}
      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          }}
        >
          <h3>Resultado da Análise</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{result}</p>
        </div>
      )}
    </div>
  );
}
