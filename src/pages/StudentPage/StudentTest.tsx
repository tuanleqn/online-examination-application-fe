import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Save, Send } from 'lucide-react'

const StudentTest = () => {
  const navigate = useNavigate()
  // Total test time in seconds (60 minutes)
  const TOTAL_TIME = 3600

  // Persist end time so timer continues across refresh. Key is scoped by pathname.
  const endTimeKey = `studentTest_end_${window.location.pathname}`

  const getOrCreateEndTime = () => {
    const stored = localStorage.getItem(endTimeKey)
    if (stored) return parseInt(stored, 10)
    const end = Date.now() + TOTAL_TIME * 1000
    localStorage.setItem(endTimeKey, String(end))
    return end
  }

  const initialEnd = getOrCreateEndTime()
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.round((initialEnd - Date.now()) / 1000)))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Mock questions
  const questions = [
    {
      id: 'q1',
      type: 'mcq',
      text: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      points: 5
    },
    {
      id: 'q2',
      type: 'true-false',
      text: 'Arrays in JavaScript are fixed in size.',
      points: 3
    },
    {
      id: 'q3',
      type: 'mcq',
      text: 'Which data structure uses LIFO (Last In First Out) principle?',
      options: ['Queue', 'Stack', 'Tree', 'Graph'],
      points: 5
    },
    {
      id: 'q4',
      type: 'true-false',
      text: 'React is a JavaScript framework.',
      points: 3
    },
    {
      id: 'q5',
      type: 'mcq',
      text: 'What is the correct way to declare a TypeScript interface?',
      options: ['class MyInterface {}', 'interface MyInterface {}', 'type MyInterface = {}', 'const MyInterface = {}'],
      points: 5
    }
  ]

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const stored = localStorage.getItem(endTimeKey)
      const end = stored ? parseInt(stored, 10) : Date.now() + TOTAL_TIME * 1000
      const t = Math.max(0, Math.round((end - Date.now()) / 1000))
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timer)
        handleSubmit()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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

  const handleSubmit = () => {
    // clear persisted end time so subsequent visits start fresh
    localStorage.removeItem(endTimeKey)
    navigate('/student/test/confirmation')
  }

  // Calculate timer color
  const totalTime = TOTAL_TIME
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
              <h1 className='text-xl font-bold'>Midterm Exam - Data Structures</h1>
              <p className='text-sm text-muted-foreground'>{questions.length} questions • {questions.reduce((sum, q) => sum + q.points, 0)} points</p>
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
          {questions.map((question, index) => (
            <div key={question.id} className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                      {index + 1}
                    </span>
                    <span className='px-2 py-1 bg-muted text-xs font-medium rounded'>{question.points} pts</span>
                  </div>
                  <p className='text-lg font-medium'>{question.text}</p>
                </div>
              </div>

              {/* Answer Input */}
              <div className='mt-4'>
                {question.type === 'mcq' && (
                  <div className='space-y-2'>
                    {question.options?.map((option, i) => (
                      <label
                        key={i}
                        className='flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors'
                      >
                        <input
                          type='radio'
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className='w-4 h-4 text-primary'
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className='flex gap-4'>
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className='flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors'
                      >
                        <input
                          type='radio'
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className='w-4 h-4 text-primary'
                        />
                        <span className='font-medium'>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className='sticky bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {Object.keys(answers).length} of {questions.length} questions answered
              </p>
              <button
                onClick={handleSubmit}
                className='flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity font-medium'
              >
                <Send className='h-4 w-4' />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentTest

