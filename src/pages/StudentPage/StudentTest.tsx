import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Clock, Save, Send, X } from 'lucide-react'
import type { TestVerifyResponse } from '@/models/Test/Question'
import type { QuestionResultDetail } from '@/models/Test/TestResult'
import { testsApi } from '@/apis/tests.api'

const StudentTest = () => {
  const navigate = useNavigate()
  const { testId } = useParams<{ testId: string }>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [testData, setTestData] = useState<TestVerifyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [studentId, setStudentId] = useState<number | null>(null)
  const [showRestoredMessage, setShowRestoredMessage] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load test data from session storage
  useEffect(() => {
    const loadTestData = async () => {
      if (!testId) {
        navigate('/student')
        return
      }

      try {
        setLoading(true)

        // Get student ID from localStorage
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          console.error('User not found')
          navigate('/student')
          return
        }

        const user = JSON.parse(userStr)
        const userId = user.id
        setStudentId(userId)

        // Load test data from session - try both numeric ID and passcode
        let sessionData = sessionStorage.getItem(`test-session-${testId}`)
        
        // If not found, try to find by checking all session keys
        if (!sessionData) {
          console.log('🔍 Session not found with key:', `test-session-${testId}`)
          console.log('🔍 Searching in all sessionStorage keys...')
          
          // List all test-session keys
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i)
            if (key && key.startsWith('test-session-')) {
              console.log('Found session key:', key)
              const data = sessionStorage.getItem(key)
              if (data) {
                const parsed = JSON.parse(data)
                // Check if this session matches current test (by testId or passcode)
                if (parsed.testId == testId || parsed.passcode == testId || parsed.testData?.testId == testId) {
                  console.log('✅ Found matching session!', parsed)
                  sessionData = data
                  break
                }
              }
            }
          }
        }
        
        if (!sessionData) {
          console.error('❌ No test session found for testId:', testId)
          navigate('/student')
          return
        }

        const session = JSON.parse(sessionData)
        setTestData(session.testData)

        console.log('📦 Test data loaded:', {
          testData: session.testData,
          testId: session.testData.testId,
          testIdFromSession: session.testId
        })

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

        // Try to restore previous answers from API
        try {
          console.log('🔄 Attempting to restore progress for:', { userId, testId, testIdType: typeof testId })
          
          // Get the actual numeric testId - try multiple sources
          const numericTestId = session.testData.testId || session.testId || parseInt(testId)
          console.log('📌 Using testId:', numericTestId, 'Type:', typeof numericTestId)
          
          // Skip if testId is still invalid
          if (!numericTestId || isNaN(numericTestId)) {
            console.log('⚠️ Invalid testId, skipping restore')
          } else {
            const progress = await testsApi.GetTestProgress({
              studentUserId: userId,
              testId: numericTestId
            })

            console.log('📥 Progress response:', progress)

            if (progress && progress.questionResultDetails) {
              const restoredAnswers: Record<string, string> = {}

              progress.questionResultDetails.forEach((question: QuestionResultDetail) => {
                console.log('📋 Processing question:', question.questionId, 'Student answer:', question.studentAnswer)
                
                if (question.studentAnswer && question.studentAnswer.length > 0) {
                  // Store the first answer ID as string
                  restoredAnswers[question.questionId.toString()] = question.studentAnswer[0].answerId.toString()
                }
              })

              console.log('✅ Restored answers object:', restoredAnswers)

              if (Object.keys(restoredAnswers).length > 0) {
                setAnswers(restoredAnswers)
                setShowRestoredMessage(true)
                console.log(`✅ Successfully restored ${Object.keys(restoredAnswers).length} previous answers`)
                
                // Hide message after 8 seconds
                setTimeout(() => setShowRestoredMessage(false), 8000)
              } else {
                console.log('⚠️ No answers found in progress data')
              }
            } else {
              console.log('⚠️ No questionResultDetails in progress')
            }
          }
        } catch (_err) {
          console.log('❌ No previous progress found or error:', _err)
        }
      } catch (error) {
        console.error('Error loading test:', error)
        navigate('/student')
      } finally {
        setLoading(false)
      }
    }

    loadTestData()
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

  // Auto-save logic - save every 1 minute (60 seconds) as draft
  useEffect(() => {
    if (!testData || !studentId || !testId) return

    const autoSaveInterval = setInterval(async () => {
      // Only auto-save if there are answers
      if (Object.keys(answers).length > 0) {
        try {
          setIsSaving(true)
          
          // Convert answers to API format
          const studentAnswerRequests = Object.entries(answers).map(([questionId, answerId]) => ({
            questionId: parseInt(questionId),
            answer: answerId
          }))

          // Use numeric testId from testData, not the URL param
          const numericTestId = testData.testId || parseInt(testId)

          console.log('💾 Auto-saving progress:', {
            testId: numericTestId,
            studentId,
            answersCount: studentAnswerRequests.length,
            studentAnswerRequests
          })

          // Save as draft to prevent data loss
          const result = await testsApi.SaveTestProgress({
            testId: numericTestId,
            studentId: studentId,
            studentAnswerRequests
          })

          setLastSaved(new Date())
          setHasUnsavedChanges(false) // Mark as saved
          console.log('✅ Auto-save successful at:', new Date().toLocaleTimeString(), 'Result:', result)
        } catch (error) {
          console.error('❌ Auto-save failed:', error)
          // Don't show error to user, just log it
        } finally {
          setIsSaving(false)
        }
      } else {
        console.log('⏭️ Skipping auto-save: No answers yet')
      }
    }, 60000) // 60 seconds = 1 minute

    return () => clearInterval(autoSaveInterval)
  }, [answers, testData, studentId, testId])

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [answers])

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && Object.keys(answers).length > 0) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Your progress is auto-saved every minute.'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, answers])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    if (!testId || !studentId || !testData) return

    try {
      // Save final answers before submitting
      if (Object.keys(answers).length > 0) {
        const studentAnswerRequests = Object.entries(answers).map(([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answer: answerId
        }))

        // Use numeric testId from testData, not the URL param (which might be passcode)
        const numericTestId = testData.testId || parseInt(testId)

        console.log('🚀 Submitting final test:', {
          testId: numericTestId,
          studentId,
          answersCount: studentAnswerRequests.length,
          studentAnswerRequests
        })

        await testsApi.SaveTestProgress({
          testId: numericTestId,
          studentId: studentId,
          studentAnswerRequests
        })

        console.log('✅ Final submission saved successfully')
      }

      // Clear persisted end time
      const endTimeKey = `studentTest_end_${testId}`
      localStorage.removeItem(endTimeKey)

      // Navigate to confirmation page
      navigate(`/student/test/${testId}/confirmation`)
    } catch (error) {
      console.error('❌ Error submitting test:', error)
      alert('Failed to submit test. Please try again.')
    }
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
              {/* Auto-save status */}
              <div className='flex items-center gap-3'>
                {isSaving && (
                  <div className='flex items-center gap-2 text-sm text-primary'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
                    <span>Saving...</span>
                  </div>
                )}
                {!isSaving && lastSaved && (
                  <div className='flex items-center gap-2 text-sm text-success'>
                    <Save className='h-4 w-4' />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {!isSaving && !lastSaved && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Save className='h-4 w-4' />
                    <span>Auto-save every 1 min</span>
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${timerBg} ${pulseClass}`}>
                <Clock className={`h-5 w-5 ${timerColor}`} />
                <span className={`text-2xl font-bold tabular-nums ${timerColor}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Restored Message */}
      {showRestoredMessage && (
        <div className='bg-success/10 border-b border-success/20'>
          <div className='container mx-auto px-4 py-3'>
            <div className='flex items-center gap-3'>
              <Save className='h-5 w-5 text-success' />
              <div>
                <p className='text-sm font-semibold text-success'>Previous progress restored!</p>
                <p className='text-xs text-success/80'>
                  Your answers from the last auto-save have been loaded. Continue where you left off.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
