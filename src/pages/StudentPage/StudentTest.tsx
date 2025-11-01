import { useEffect, useRef, useState } from 'react'

const StudentTest = () => {
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
  ]

  // selected answers mapping: questionId -> selected value
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Timer: test duration in minutes (adjust as needed or read from props/route)
  const TEST_DURATION_MINUTES = 15
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_MINUTES * 60) // seconds
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // start countdown
    if (submitted) return
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [submitted])

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      // time's up
      handleSubmit(true)
    }
  }, [timeLeft, submitted])

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(Math.max(0, seconds) / 60)
    const s = Math.floor(Math.max(0, seconds) % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSubmit = (auto = false) => {
    // stop timer
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSubmitted(true)
    // For now show selected answers and indicate auto/manual
    const header = auto ? 'Time is up! Auto-submitted answers:\n' : 'Submitted answers:\n'
    alert(header + JSON.stringify(answers, null, 2))
    console.log('Submitted answers', answers)
  }

  const handleSubmitClick = () => handleSubmit(false)

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Questions */}
      <div className='container mx-auto px-4 py-8'>
          <div className='max-w-3xl mx-auto space-y-6'>
            {/* Timer */}
            <div className='flex justify-end'>
              <div className={`px-3 py-1 rounded font-mono font-semibold ${timeLeft <= 60 ? 'bg-danger/10 text-danger' : 'bg-muted/10 text-foreground'}`}>
                Time left: {formatTime(timeLeft)}
              </div>
            </div>
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

              {/* Display options for MCQ */}
              {question.type === 'mcq' && question.options && (
                <div className='mt-4 space-y-2'>
                  {question.options.map((option, i) => {
                    const selected = answers[question.id] === option
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          selected ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'
                        } cursor-pointer`}
                      >
                          <input
                            type='radio'
                            name={question.id}
                            checked={selected}
                            onChange={() => setAnswer(question.id, option)}
                            className='w-4 h-4 text-primary'
                            disabled={submitted || timeLeft <= 0}
                          />
                        <span className='text-sm text-muted-foreground font-medium'>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{option}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Display True/False options */}
              {question.type === 'true-false' && (
                <div className='mt-4 flex gap-4'>
                  {['True', 'False'].map((v) => {
                    const selected = answers[question.id] === v
                    return (
                      <button
                        key={v}
                        onClick={() => setAnswer(question.id, v)}
                        className={`flex-1 p-3 rounded-lg border ${
                          selected ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'
                        }`}
                        disabled={submitted || timeLeft <= 0}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          <div className='mt-6 flex justify-end'>
            <button onClick={handleSubmitClick} disabled={submitted || timeLeft <= 0} className={`px-6 py-3 rounded-lg ${submitted || timeLeft <= 0 ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
              {submitted ? 'Submitted' : 'Submit Answers'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentTest
