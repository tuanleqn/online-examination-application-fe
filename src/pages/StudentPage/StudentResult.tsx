import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Eye, Award, HelpCircle, X, Loader2 } from 'lucide-react'
import { aiApi } from '@/apis/ai.api'
import { testsApi } from '@/apis/tests.api'
import type { StudentSubmissionResponse, QuestionResultDetail, AnswerOption } from '@/models/Test/TestResult'

const StudentResult = () => {
  const { testId } = useParams<{ testId: string }>()
  const [submission, setSubmission] = useState<StudentSubmissionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answersReleased, setAnswersReleased] = useState(false)
  const [scoresReleased, setScoresReleased] = useState(false)

  // AI Explanation state
  const [showExplanation, setShowExplanation] = useState<number | null>(null)
  const [explanation, setExplanation] = useState<string>('')
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [explanationError, setExplanationError] = useState<string | null>(null)

  useEffect(() => {
    if (testId) {
      fetchMyResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  const fetchMyResult = async () => {
    try {
      setLoading(true)

      // TODO: Uncomment khi đã có user.id trong localStorage
      // const userStr = localStorage.getItem('user')
      // const user = userStr ? JSON.parse(userStr) : null
      // const studentUserId = user?.id || 3

      // Temporary: Sử dụng giá trị mặc định
      const studentUserId = 3
      const testIdNumber = 2 // Mặc định testId = 1, sau này sẽ lấy từ params

      const data = await testsApi.getStudentSubmission({
        testId: testIdNumber,
        studentUserId: studentUserId
      })

      setSubmission(data)
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

  const getQuestionType = (answers: AnswerOption[]) => {
    // Kiểm tra nếu là True/False
    if (answers.length === 2) {
      const hasTrue = answers.some((a) => a.answerText.toLowerCase() === 'true')
      const hasFalse = answers.some((a) => a.answerText.toLowerCase() === 'false')
      if (hasTrue && hasFalse) return 'True/False'
    }

    // Kiểm tra nếu chỉ có 1 answer (Short Answer)
    if (answers.length === 1) return 'Short Answer'

    // Còn lại là Multiple Choice
    return 'Multiple Choice'
  }

  const handleWhyClick = async (question: QuestionResultDetail) => {
    const studentAnswer = question.studentAnswer[0]
    const correctAnswer = question.answers.find((a) => a.isCorrect)

    if (!studentAnswer || !correctAnswer) return

    setShowExplanation(question.questionId)
    setLoadingExplanation(true)
    setExplanationError(null)
    setExplanation('')

    try {
      // Nếu student chọn đúng, incorrect_answer_text sẽ là chuỗi rỗng
      const incorrectAnswerText = studentAnswer.isCorrect ? '' : studentAnswer.answerText

      const result = await aiApi.assessAnswer({
        question_text: question.questionText,
        incorrect_answer_text: incorrectAnswerText,
        correct_answer_text: correctAnswer.answerText
      })
      setExplanation(result)
    } catch (err) {
      console.error('Error fetching explanation:', err)
      setExplanationError('Could not generate an explanation at this time. Please try again later.')
    } finally {
      setLoadingExplanation(false)
    }
  }

  const closeExplanation = () => {
    setShowExplanation(null)
    setExplanation('')
    setExplanationError(null)
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
          {/* Encouragement Message */}
          <div className='bg-success/10 border border-success/30 rounded-xl p-6'>
            <div className='flex items-center gap-3'>
              <Award className='h-6 w-6 text-success' />
              <p className='text-success font-medium'>
                Congratulations on completing the test! Keep up the great effort.
              </p>
            </div>
          </div>

          {/* Score Card */}
          <div className='bg-primary/80 rounded-xl p-8 text-primary-foreground'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <Award className='h-8 w-8' />
                  <h2 className='text-2xl font-bold'>Your Score</h2>
                </div>
                <p className='opacity-90'>
                  Submitted on{' '}
                  {new Date(submission.attemptDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-6xl font-bold'>{submission.score.toFixed(1)}</p>
                <p className='text-2xl opacity-90'>out of {submission.maxScore}</p>
                <p className='text-lg mt-2 opacity-90'>
                  {submission.maxScore > 0 ? Math.round((submission.score / submission.maxScore) * 100) : 0}%
                </p>
              </div>
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
                  {submission.totalQuestions > 0
                    ? Math.round((submission.totalCorrectQuestions / submission.totalQuestions) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Question Answers */}
          {submission.questionResultDetails.map((question: QuestionResultDetail, index: number) => {
            const studentAnswer = question.studentAnswer[0]
            const questionType = getQuestionType(question.answers)
            const isShortAnswer = questionType === 'Short Answer'

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
                      <span className='text-xs text-muted-foreground uppercase'>{questionType}</span>

                      {/* Why Button - Only for MCQ and True/False */}
                      {!isShortAnswer && studentAnswer && answersReleased && (
                        <button
                          onClick={() => handleWhyClick(question)}
                          className='ml-auto px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg flex items-center gap-2 transition-colors text-sm font-medium'
                        >
                          <HelpCircle className='h-4 w-4' />
                          Why?
                        </button>
                      )}
                    </div>
                    <h3 className='text-lg font-medium mb-3'>{question.questionText}</h3>

                    {/* Answer Options - Only for MCQ and True/False */}
                    {!isShortAnswer && (
                      <div className='space-y-2 mb-4'>
                        {question.answers.map((answer: AnswerOption, optionIndex: number) => {
                          const isSelected = question.studentAnswer.some((sa) => sa.answerId === answer.answerId)
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
                                  {questionType === 'True/False'
                                    ? answer.answerText
                                    : `${String.fromCharCode(65 + optionIndex)}. ${answer.answerText}`}
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

                    {/* Short Answer Display */}
                    {isShortAnswer && (
                      <div className='space-y-3 mb-4'>
                        <div className='p-4 bg-muted/30 rounded-lg border border-border'>
                          <p className='text-sm text-muted-foreground mb-1'>Your Answer:</p>
                          <p className='text-foreground'>{studentAnswer?.answerText || 'No answer provided'}</p>
                        </div>
                        {answersReleased && question.answers[0] && (
                          <div className='p-4 bg-success/5 rounded-lg border border-success/20'>
                            <p className='text-sm text-success mb-1'>Sample Answer:</p>
                            <p className='text-foreground'>{question.answers[0].answerText}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Explanation Modal */}
                    {showExplanation === question.questionId && (
                      <div className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg'>
                        <div className='flex items-start justify-between mb-3'>
                          <h4 className='font-semibold text-primary flex items-center gap-2'>
                            <HelpCircle className='h-5 w-5' />
                            Explanation
                          </h4>
                          <button
                            onClick={closeExplanation}
                            className='text-muted-foreground hover:text-foreground transition-colors'
                          >
                            <X className='h-5 w-5' />
                          </button>
                        </div>

                        {loadingExplanation ? (
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            <span>Generating explanation...</span>
                          </div>
                        ) : explanationError ? (
                          <p className='text-danger text-sm'>{explanationError}</p>
                        ) : (
                          <div className='text-sm text-foreground whitespace-pre-line'>{explanation}</div>
                        )}
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
                  <p className='text-2xl font-bold'>
                    {submission.maxScore > 0 ? Math.round((submission.score / submission.maxScore) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Status</p>
                  <p className='text-2xl font-bold'>
                    {submission.maxScore > 0 && (submission.score / submission.maxScore) * 100 >= 60 ? (
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
