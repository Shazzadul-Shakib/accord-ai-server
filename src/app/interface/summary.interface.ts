// Interface for the expected JSON response structure
interface SummaryPoint {
  time: string;
  event: string;
}
export interface SummaryResponse {
  summary: {
    title: string;
    description: string;
    points: SummaryPoint[];
    conclusions: string[];
    metadata?: {
      wordCount: number;
      participantCount: number;
      timestamp: string;
    };
  };
}
