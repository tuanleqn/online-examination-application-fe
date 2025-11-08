import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Clock, Save, Send, X } from 'lucide-react'
import type { TestVerifyResponse } from '@/models/Test/Question'

const StudentTest = () => {
  const navigate = useNavigate()
  const { testId } = useParams<{ testId: string }>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [testData, setTestData] = useState<TestVerifyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  // Load test data from session storage
  useEffect(() => {
    if (!testId) {
      navigate('/student')
      return
    }

    const sessionData = sessionStorage.getItem(`test-session-${testId}`)
    if (!sessionData) {
      console.error('No test session found')
      navigate('/student')
      return
    }

    const session = JSON.parse(sessionData)
    setTestData(session.testData)

    // Initialize timer
    const endTimeKey = `studentTest_end_${testId}`
    const storedEndTime = localStorage.getItem(endTimeKey)
    
    if (storedEndTime) {
      // Continue from stored time
      const remainingTime = Math.max(0, Math.round((parseInt(storedEndTime, 10) - Date.now()) / 1000))
      setTimeLeft(remainingTime)
    } else {
      // Start new timer
      const durationInSeconds = session.testData.duration * 60
      const endTime = Date.now() + durationInSeconds * 1000
      localStorage.setItem(endTimeKey, String(endTime))
      setTimeLeft(durationInSeconds)
    }

    setLoading(false)
  }, [testId, navigate])

  // Timer logic
  useEffect(() => {
    if (!testData || !testId) return

    const endTimeKey = `studentTest_end_${testId}`
    
    const timer = setInterval(() => {
      const storedEndTime = localStorage.getItem(endTimeKey)
      if (!storedEndTime) return

      const remainingTime = Math.max(0, Math.round((parseInt(storedEndTime, 10) - Date.now()) / 1000))
      setTimeLeft(remainingTime)
      
      if (remainingTime <= 0) {
        clearInterval(timer)
        handleConfirmSubmit()
      }
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testData, testId])

  // Auto-save logic
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        // Simulate save
        setLastSaved(new Date())
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSave)
  }, [answers])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = () => {
    if (!testId) return
    
    // Clear persisted end time so subsequent visits start fresh
    const endTimeKey = `studentTest_end_${testId}`
    localStorage.removeItem(endTimeKey)
    
    // Navigate to confirmation page
    navigate(`/student/test/${testId}/confirmation`)
  }

  const handleCancelSubmit = () => {
    setShowConfirmModal(false)
  }

  if (loading || !testData) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading test...</p>
        </div>
      </div>
    )
  }

  const questions = testData.questions

  // Calculate timer color
  const totalTime = testData.duration * 60 // in seconds
  const timePercentage = (timeLeft / totalTime) * 100
  let timerColor = 'text-timer-safe'
  let timerBg = 'bg-success-light'
  let pulseClass = ''

  if (timePercentage < 20) {
    timerColor = 'text-timer-critical'
    timerBg = 'bg-danger-light'
    pulseClass = 'timer-pulse'
  } else if (timePercentage < 50) {
    timerColor = 'text-timer-warning'
    timerBg = 'bg-warning-light'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Sticky Header with Timer */}
      <header className='sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-bold'>{testData.title}</h1>
              <p className='text-sm text-muted-foreground'>
                {testData.totalQuestions} questions • {testData.questions.reduce((sum, q) => sum + q.score, 0)} points
              </p>
            </div>
            <div className='flex items-center gap-4'>
              {lastSaved && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Save className='h-4 w-4' />
                  Saved at {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${timerBg} ${pulseClass}`}>
                <Clock className={`h-5 w-5 ${timerColor}`} />
                <span className={`text-2xl font-bold tabular-nums ${timerColor}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Questions */}
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto space-y-6'>
          {questions.map((question, index) => {
            const hasMultipleAnswers = question.answers.length > 2
            const isTrueFalse =
              question.answers.length === 2 &&
              question.answers.some(
                (a) => a.answerText.toLowerCase() === 'true' || a.answerText.toLowerCase() === 'false'
              )
            
            return (
              <div key={question.questionId} className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                        {index + 1}
                      </span>
                      <span className='px-2 py-1 bg-muted text-xs font-medium rounded'>{question.score} pts</span>
                    </div>
                    <p className='text-lg font-medium'>{question.questionText}</p>
                  </div>
                </div>

                {/* Answer Input */}
                <div className='mt-4'>
                  {hasMultipleAnswers && !isTrueFalse && (
                    <div className='space-y-2'>
                      {question.answers.map((answer) => (
                        <label
                          key={answer.answerId}
                          className='flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors'
                        >
                          <input
                            type='radio'
                            name={`question-${question.questionId}`}
                            value={answer.answerId.toString()}
                            checked={answers[question.questionId.toString()] === answer.answerId.toString()}
                            onChange={(e) => handleAnswerChange(question.questionId.toString(), e.target.value)}
                            className='w-4 h-4 text-primary'
                          />
                          <span>{answer.answerText}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {isTrueFalse && (
                    <div className='flex gap-4'>
                      {question.answers.map((answer) => (
                        <label
                          key={answer.answerId}
                          className='flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors'
                        >
                          <input
                            type='radio'
                            name={`question-${question.questionId}`}
                            value={answer.answerId.toString()}
                            checked={answers[question.questionId.toString()] === answer.answerId.toString()}
                            onChange={(e) => handleAnswerChange(question.questionId.toString(), e.target.value)}
                            className='w-4 h-4 text-primary'
                          />
                          <span className='font-medium'>{answer.answerText}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {!hasMultipleAnswers && !isTrueFalse && (
                    <textarea
                      value={answers[question.questionId.toString()] || ''}
                      onChange={(e) => handleAnswerChange(question.questionId.toString(), e.target.value)}
                      placeholder='Type your answer here...'
                      className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]'
                    />
                  )}
                </div>
              </div>
            )
          })}

          {/* Submit Button */}
          <div className='sticky bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {Object.keys(answers).length} of {questions.length} questions answered
              </p>
              <button
                onClick={handleSubmitClick}
                className='flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity font-medium'
              >
                <Send className='h-4 w-4' />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200'>
            <div className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='shrink-0 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center'>
                  <AlertTriangle className='h-6 w-6 text-warning' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-foreground mb-2'>Submit Test?</h3>
                  <p className='text-sm text-muted-foreground mb-1'>
                    {Object.keys(answers).length === questions.length
                      ? 'You have answered all questions.'
                      : `You have ${questions.length - Object.keys(answers).length} unanswered question${
                          questions.length - Object.keys(answers).length > 1 ? 's' : ''
                        }.`}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Are you sure you want to submit this test? You cannot change your answers after submission.
                  </p>
                </div>
                <button
                  onClick={handleCancelSubmit}
                  className='shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='border-t border-border p-4 flex gap-3'>
              <button
                onClick={handleCancelSubmit}
                className='flex-1 px-4 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors font-medium'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className='flex-1 px-4 py-2.5 border border-border text-foreground hover:bg-muted/50 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity font-medium'
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentTest
