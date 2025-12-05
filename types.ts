export interface AnalysisResult {
  aiScore: number; // 0 to 100
  humanScore: number; // 0 to 100
  verdict: string;
  confidence: string; // "Baixa", "Média", "Alta"
  reasoning: string;
  flags: string[]; // List of potential indicators (e.g., "Repetitive structure", "Lack of emotion")
  toneAnalysis: {
    label: string;
    score: number;
  }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
