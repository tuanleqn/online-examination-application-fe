export interface TestResultResponse {
  attemptId: {
    studentUserId: number
    testId: number
  }
  duration: string
  score: number
  testId: number
  releasedAnswer: boolean
  totalQuestions: number
  releasedScore: boolean
  maxScore: number
  testName: string
  studentId: number
  studentName: string
}

export interface AnswerOption {
  answerId: number
  answerText: string
  isCorrect: boolean
}

export interface QuestionResultDetail {
  questionId: number
  questionText: string
  score: number
  maxScore: number
  answers: AnswerOption[]
  studentAnswer: AnswerOption[]
}

export interface StudentSubmissionResponse {
  testName: string
  attemptDate: string
  totalTimes: string
  totalQuestions: number
  totalCorrectQuestions: number
  score: number
  maxScore: number
  questionResultDetails: QuestionResultDetail[]
}

export interface PerformanceSummary {
  testId: number
  testName: string
  maxScore: number
  minScore: number
  averageScore: number
  totalSubmissions: number
}
