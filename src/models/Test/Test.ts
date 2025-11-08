export interface Test {
  testId: number
  title: string
  description: string
  duration: number
  questions: number
  passCode: string
  classId: string
  status: boolean
  releasedAnswer: boolean
  releasedScore: boolean
  creator: {
    createdAt: string
    fullName: string
  }
}
