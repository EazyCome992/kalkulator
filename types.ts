
export type Operation = '+' | '-' | '*' | '/' | '%' | null;

export interface CalculationResult {
  expression: string;
  result: string;
  timestamp: number;
}

export interface AiExplanation {
  explanation: string;
  steps: string[];
}
