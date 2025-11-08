export type QuestionType = 'mcq' | 'true-false' | 'short-answer'

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[] // for MCQ
  correctAnswer: string | string[]
  points: number
  explanation?: string
  references?: string[]
}

// API Response Types
export interface Answer {
  answerId: number
  answerText: string
  correctAnswer: boolean
}

export interface QuestionResponse {
  questionId: number
  questionText: string
  score: number
  answers: Answer[]
}

export interface TestVerifyResponse {
  testId?: number
  description: string
  title: string
  duration: number
  totalQuestions: number
  questions: QuestionResponse[]
  passcode?: string
}
