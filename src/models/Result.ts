export interface Result {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  submittedAt: Date;
  timeTaken: number; // seconds
  isReleased: boolean;
}
