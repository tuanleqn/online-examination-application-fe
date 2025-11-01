export interface Test {
  id: string;
  title: string;
  duration: number; // minutes
  startTime: Date;
  endTime: Date;
  passcode: string;
  classId: string;
  questions: string[]; // question IDs
  status: 'draft' | 'active' | 'closed';
  createdBy: string;
  createdAt: Date;
}