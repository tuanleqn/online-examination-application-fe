import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff, Award } from 'lucide-react'
// import { testsApi } from '@/apis/tests.api'
import type { StudentSubmissionResponse, QuestionResultDetail, AnswerOption } from '@/models/Test/TestResult'

const StudentResult = () => {
  const { testId } = useParams<{ testId: string }>()
  const [submission, setSubmission] = useState<StudentSubmissionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answersReleased, setAnswersReleased] = useState(false)
  const [scoresReleased, setScoresReleased] = useState(false)

  useEffect(() => {
    if (testId) {
      fetchMyResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  const fetchMyResult = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call when ready
      // const studentUserId = Number(localStorage.getItem('userId'))
      // const data = await testsApi.getStudentSubmission({
      //   testId: Number(testId!),
      //   studentUserId
      // })

      // Mock data theo cấu trúc TestResult
      const mockSubmission: StudentSubmissionResponse = {
        testName: 'Data Structures Quiz 2',
        attemptDate: '2024-01-15T10:30:00',
        totalTimes: '45:30', // 45 phút 30 giây
        totalQuestions: 4,
        totalCorrectQuestions: 3,
        score: 8.5,
        maxScore: 10,
        questionResultDetails: [
          {
            questionId: 1,
            questionText: 'What is a Binary Search Tree?',
            score: 2.5,
            maxScore: 3,
            answers: [], // Short answer không có options
            studentAnswer: [
              {
                answerId: 101,
                answerText:
                  'A Binary Search Tree is a tree data structure where each node has at most two children, and the left child is less than the parent while the right child is greater.',
                isCorrect: false // Sẽ được chấm bởi giáo viên
              }
            ]
          },
          {
            questionId: 2,
            questionText: 'Which of the following is a valid time complexity for Binary Search?',
            score: 2,
            maxScore: 2,
            answers: [
              { answerId: 201, answerText: 'O(n)', isCorrect: false },
              { answerId: 202, answerText: 'O(log n)', isCorrect: true },
              { answerId: 203, answerText: 'O(n^2)', isCorrect: false },
              { answerId: 204, answerText: 'O(1)', isCorrect: false }
            ],
            studentAnswer: [{ answerId: 202, answerText: 'O(log n)', isCorrect: true }]
          },
          {
            questionId: 3,
            questionText: 'Explain the difference between Stack and Queue.',
            score: 3,
            maxScore: 3,
            answers: [],
            studentAnswer: [
              {
                answerId: 301,
                answerText:
                  'Stack follows LIFO (Last In First Out) principle where the last element inserted is the first to be removed. Queue follows FIFO (First In First Out) principle where the first element inserted is the first to be removed.',
                isCorrect: false
              }
            ]
          },
          {
            questionId: 4,
            questionText: 'What is the worst-case time complexity of QuickSort?',
            score: 0,
            maxScore: 2,
            answers: [
              { answerId: 401, answerText: 'O(n log n)', isCorrect: false },
              { answerId: 402, answerText: 'O(n^2)', isCorrect: true },
              { answerId: 403, answerText: 'O(n)', isCorrect: false },
              { answerId: 404, answerText: 'O(log n)', isCorrect: false }
            ],
            studentAnswer: [{ answerId: 401, answerText: 'O(n log n)', isCorrect: false }]
          }
        ]
      }

      setSubmission(mockSubmission)
      // Mock: Answers and scores are released
      setAnswersReleased(true)
      setScoresReleased(true)
      setError(null)
    } catch (err) {
      console.error('Error fetching result:', err)
      setError('Failed to load your result')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-danger'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='mt-4 text-muted-foreground'>Loading your result...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-danger mb-4'>{error || 'Result not found'}</p>
          <Link
            to='/student'
            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors inline-block'
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                to='/student'
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Back</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <div>
                <h1 className='text-xl font-bold text-foreground'>{submission.testName}</h1>
                <p className='text-sm text-muted-foreground'>Test Result</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Score Card */}
          <div className='bg-primary/80 rounded-xl p-8 text-primary-foreground'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <Award className='h-8 w-8' />
                  <h2 className='text-2xl font-bold'>Your Score</h2>
                </div>
                <p className='opacity-90'>Submitted on {new Date(submission.attemptDate).toLocaleString()}</p>
              </div>
              {scoresReleased ? (
                <div className='text-right'>
                  <p className='text-6xl font-bold'>{submission.score.toFixed(1)}</p>
                  <p className='text-2xl opacity-90'>out of {submission.maxScore}</p>
                  <p className='text-lg mt-2 opacity-90'>
                    {Math.round((submission.score / submission.maxScore) * 100)}%
                  </p>
                </div>
              ) : (
                <div className='flex items-center gap-3 opacity-80'>
                  <EyeOff className='h-6 w-6' />
                  <p className='text-lg'>Scores not yet released</p>
                </div>
              )}
            </div>
          </div>

          {/* Test Statistics */}
          <div className='bg-card border border-border rounded-xl p-6'>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Duration</p>
                <p className='font-medium'>{submission.totalTimes}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Correct Answers</p>
                <p className='font-medium'>
                  {submission.totalCorrectQuestions}/{submission.totalQuestions}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Accuracy</p>
                <p className='font-medium'>
                  {Math.round((submission.totalCorrectQuestions / submission.totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Answers Released Status */}
          {!answersReleased && (
            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <EyeOff className='h-5 w-5' />
                <p>Your instructor hasn't released the answers yet. Check back later!</p>
              </div>
            </div>
          )}

          {/* Question Answers */}
          {submission.questionResultDetails.map((question: QuestionResultDetail, index: number) => {
            const studentAnswer = question.studentAnswer[0]
            const isMultipleChoice = question.answers.length > 0

            return (
              <div key={question.questionId} className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded'>
                        Question {index + 1}
                      </span>
                      {scoresReleased && (
                        <span className='px-2 py-1 bg-muted text-sm font-medium rounded'>
                          {question.score.toFixed(1)} / {question.maxScore} points
                        </span>
                      )}
                      <span className='text-xs text-muted-foreground uppercase'>
                        {isMultipleChoice ? 'Multiple Choice' : 'Short Answer'}
                      </span>
                    </div>
                    <h3 className='text-lg font-medium mb-3'>{question.questionText}</h3>

                    {/* Multiple Choice Options */}
                    {isMultipleChoice && (
                      <div className='space-y-2 mb-4'>
                        {question.answers.map((answer: AnswerOption, optionIndex: number) => {
                          const isSelected = studentAnswer?.answerId === answer.answerId
                          const isCorrect = answer.isCorrect

                          return (
                            <div
                              key={answer.answerId}
                              className={`p-3 rounded-lg border ${
                                isSelected && isCorrect
                                  ? 'bg-success/10 border-success'
                                  : isSelected && !isCorrect
                                    ? 'bg-danger/10 border-danger'
                                    : isCorrect && answersReleased
                                      ? 'bg-success/5 border-success/30'
                                      : 'bg-background border-border'
                              }`}
                            >
                              <div className='flex items-center gap-2'>
                                {isSelected && (
                                  <span className='text-sm font-medium'>
                                    {isCorrect ? (
                                      <CheckCircle2 className='h-4 w-4 text-success' />
                                    ) : (
                                      <XCircle className='h-4 w-4 text-danger' />
                                    )}
                                  </span>
                                )}
                                <span
                                  className={`${isSelected ? 'font-medium' : ''} ${answersReleased && isCorrect ? 'text-success' : ''}`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {answer.answerText}
                                </span>
                                {isCorrect && !isSelected && answersReleased && (
                                  <span className='ml-auto text-xs text-success flex items-center gap-1'>
                                    <Eye className='h-3 w-3' />
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Short Answer Question */}
                    {!isMultipleChoice && studentAnswer && (
                      <div className='space-y-3'>
                        <div>
                          <p className='text-sm text-muted-foreground mb-2'>Your Answer:</p>
                          <div className='p-4 bg-muted/50 border border-border rounded-lg'>
                            <p className='text-foreground'>{studentAnswer.answerText || 'No answer provided'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score for this question */}
                {scoresReleased && (
                  <div className='mt-4 pt-4 border-t border-border'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Points Earned:</span>
                      <span className={`text-xl font-bold ${getScoreColor(question.score, question.maxScore)}`}>
                        {question.score.toFixed(1)} / {question.maxScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Summary Card */}
          {scoresReleased && (
            <div className='bg-card border border-border rounded-xl p-6'>
              <h2 className='text-xl font-bold mb-4'>Summary</h2>
              <div className='grid md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Total Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(submission.score, submission.maxScore)}`}>
                    {submission.score.toFixed(1)} / {submission.maxScore}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Percentage</p>
                  <p className='text-2xl font-bold'>{Math.round((submission.score / submission.maxScore) * 100)}%</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Status</p>
                  <p className='text-2xl font-bold'>
                    {(submission.score / submission.maxScore) * 100 >= 60 ? (
                      <span className='text-success'>Passed</span>
                    ) : (
                      <span className='text-danger'>Failed</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentResult
