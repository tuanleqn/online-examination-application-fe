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