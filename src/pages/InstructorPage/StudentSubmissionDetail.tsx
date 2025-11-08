import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { testsApi } from '@/apis/tests.api'
import type { StudentSubmissionResponse, QuestionResultDetail } from '@/models/Test/TestResult'

const StudentSubmissionDetail = () => {
  const { testId, studentId } = useParams<{ testId: string; studentId: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<StudentSubmissionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (testId && studentId) {
      fetchSubmissionDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, studentId])

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true)
      const data = await testsApi.getStudentSubmission({
        testId: parseInt(testId!),
        studentUserId: parseInt(studentId!)
      })
      setSubmission(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching submission:', err)
      setError('Failed to load submission details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='mt-4 text-muted-foreground'>Loading submission...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-danger mb-4'>{error || 'Submission not found'}</p>
          <button
            onClick={() => navigate(`/instructor/test/${testId}/results`)}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
          >
            Back to Results
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                to={`/instructor/test/${testId}/results`}
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Back to Results</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <div>
                <h1 className='text-xl font-bold text-foreground'>{submission.testName}</h1>
                <p className='text-sm text-muted-foreground'>
                  Submitted: {new Date(submission.attemptDate).toLocaleString()}
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground mb-1'>Total Score</p>
              <p className='text-3xl font-bold'>
                {submission.score.toFixed(1)}
                <span className='text-lg text-muted-foreground'>/{submission.maxScore}</span>
              </p>
              <p className='text-sm text-muted-foreground'>
                {Math.round((submission.score / submission.maxScore) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Submission Info */}
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

          {/* Questions */}
          {submission.questionResultDetails.map((question: QuestionResultDetail, index: number) => {
            const studentAnswer = question.studentAnswer[0]
            const isMultipleChoice = question.answers.length > 1

            return (
              <div key={question.questionId} className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded'>
                        Q{index + 1}
                      </span>
                      <span className='px-2 py-1 bg-muted text-sm font-medium rounded'>
                        {question.maxScore} point{question.maxScore !== 1 ? 's' : ''}
                      </span>
                      <span className='text-xs text-muted-foreground uppercase'>
                        {isMultipleChoice ? 'Multiple Choice' : 'Essay'}
                      </span>
                    </div>
                    <h3 className='text-lg font-medium mb-3'>{question.questionText}</h3>

                    {/* Multiple Choice Options */}
                    {isMultipleChoice && (
                      <div className='space-y-2 mb-4'>
                        {question.answers.map((answer, optionIndex) => {
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
                                    : isCorrect
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
                                  className={`${isSelected ? 'font-medium' : ''} ${isCorrect ? 'text-success' : ''}`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {answer.answerText}
                                </span>
                                {isCorrect && !isSelected && (
                                  <span className='ml-auto text-xs text-success'>(Correct Answer)</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Essay Answer */}
                    {!isMultipleChoice && studentAnswer && (
                      <div className='mt-3'>
                        <p className='text-sm text-muted-foreground mb-2'>Student's Answer:</p>
                        <div className='p-4 bg-muted/50 border border-border rounded-lg'>
                          <p className='text-foreground'>{studentAnswer.answerText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Display */}
                <div className='mt-4 pt-4 border-t border-border'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-muted-foreground mb-2'>Score</p>
                      <p className='text-2xl font-bold'>
                        {question.score.toFixed(1)}
                        <span className='text-lg text-muted-foreground'>/{question.maxScore}</span>
                      </p>
                    </div>
                    {studentAnswer && (
                      <div className='flex items-center gap-2'>
                        {studentAnswer.isCorrect ? (
                          <>
                            <CheckCircle2 className='h-5 w-5 text-success' />
                            <span className='text-success font-medium'>Correct</span>
                          </>
                        ) : (
                          <>
                            <XCircle className='h-5 w-5 text-danger' />
                            <span className='text-danger font-medium'>Incorrect</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StudentSubmissionDetail
