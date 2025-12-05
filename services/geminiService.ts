import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("API Key is missing! Make sure VITE_GEMINI_API_KEY is set in .env.local");
}
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const analyzeTextForAI = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analise o texto a seguir e determine a probabilidade de ter sido escrito por uma Inteligência Artificial versus um Humano.
      
      Texto para análise:
      "${text}"
      
      Atue como um especialista em linguística forense e detecção de padrões de LLM (Large Language Models).
      Procure por:
      1. Perplexidade e estagnação (texto muito previsível).
      2. Estruturas de frases repetitivas.
      3. Falta de nuances emocionais profundas ou experiências pessoais anedóticas genuínas.
      4. Uso excessivo de conectivos lógicos perfeitos.
      
      Retorne os dados estritamente no formato JSON solicitado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiScore: { type: Type.NUMBER, description: "Percentual de probabilidade de ser IA (0-100)" },
            humanScore: { type: Type.NUMBER, description: "Percentual de probabilidade de ser Humano (0-100)" },
            verdict: { type: Type.STRING, description: "Veredito curto (ex: 'Provavelmente IA', 'Misto', 'Humano')" },
            confidence: { type: Type.STRING, description: "Nível de confiança da análise (Baixa, Média, Alta)" },
            reasoning: { type: Type.STRING, description: "Explicação detalhada de 2-3 frases sobre o porquê do resultado." },
            flags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 marcadores encontrados (ex: 'Estrutura monótona', 'Vocabulário genérico')"
            },
            toneAnalysis: {
              type: Type.ARRAY,
              description: "Análise de tom emocional (ex: Formal, Criativo, Robótico)",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER, description: "Valor de 0 a 100" }
                }
              }
            }
          },
          required: ["aiScore", "humanScore", "verdict", "confidence", "reasoning", "flags", "toneAnalysis"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(resultText) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};
