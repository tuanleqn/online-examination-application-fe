import { ArrowLeft, User, IdCard, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Test } from '@/models/Test/Test'

const BeginTest = () => {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [test, setTest] = useState<Test | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    studentId: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    // Load test from localStorage
    const tests: Test[] = JSON.parse(localStorage.getItem('tests') || '[]')
    const foundTest = tests.find((t) => t.id === testId)

    if (!foundTest) {
      navigate('/student')
      return
    }

    setTest(foundTest)
  }, [testId, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleBeginTest = () => {
    // Validate: at least one field must be filled
    if (!formData.name.trim() && !formData.studentId.trim()) {
      setError('Please enter your Name or Student ID to continue.')
      return
    }

    // Store student info in session/localStorage
    const studentInfo = {
      name: formData.name.trim() || 'Anonymous',
      studentId: formData.studentId.trim() || 'N/A',
      testId: testId,
      startedAt: new Date().toISOString()
    }
    sessionStorage.setItem(`test-${testId}-student`, JSON.stringify(studentInfo))

    // Navigate to actual test taking page (to be implemented)
    navigate(`/student/test/${testId}/take`)
  }

  if (!test) return null

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-4'>
            <Link
              to='/student'
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-5 w-5' />
              <span>Back</span>
            </Link>
            <div className='h-6 w-px bg-border' />
            <h1 className='text-xl font-bold text-foreground'>Begin Test</h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          {/* Test Info Card */}
          <div className='bg-card border border-border rounded-xl p-6 mb-6'>
            <h2 className='text-2xl font-bold mb-2'>{test.title}</h2>
            <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
              <span>Duration: {test.duration} minutes</span>
              <span>•</span>
              <span>Class: {test.classId || 'General'}</span>
            </div>
          </div>

          {/* Student Information Form */}
          <div className='bg-card border border-border rounded-xl p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center'>
                <AlertTriangle className='h-6 w-6 text-warning' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>Student Information Required</h3>
                <p className='text-sm text-muted-foreground'>
                  Please enter your name or student ID before starting the test
                </p>
              </div>
            </div>

            <div className='space-y-5'>
              {/* Name Field */}
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-foreground mb-2'>
                  Full Name
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Enter your full name'
                    className='w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors'
                  />
                </div>
              </div>

              {/* Student ID Field */}
              <div>
                <label htmlFor='studentId' className='block text-sm font-medium text-foreground mb-2'>
                  Student ID
                </label>
                <div className='relative'>
                  <IdCard className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <input
                    type='text'
                    id='studentId'
                    name='studentId'
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder='Enter your student ID'
                    className='w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors'
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className='flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/20 text-danger rounded-lg'>
                  <AlertTriangle className='h-5 w-5 flex-shrink-0' />
                  <p className='text-sm font-medium'>{error}</p>
                </div>
              )}

              {/* Info Note */}
              <div className='flex items-start gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg'>
                <AlertTriangle className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                <p className='text-sm text-muted-foreground'>
                  <strong className='text-foreground'>Note:</strong> At least one field (Name or Student ID) is required
                  to proceed. This information will be used to identify your submission.
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-4'>
                <Link
                  to='/student'
                  className='flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors text-center font-medium'
                >
                  Cancel
                </Link>
                <button
                  onClick={handleBeginTest}
                  className='flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium'
                >
                  Begin Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeginTest
