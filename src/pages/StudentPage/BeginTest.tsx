import { ArrowLeft, Clock, FileText, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { TestVerifyResponse } from '@/models/Test/Question'
import { testsApi } from '@/apis/tests.api'

const BeginTest = () => {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [test, setTest] = useState<TestVerifyResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTestByPasscode = async () => {
      if (!testId) {
        navigate('/student')
        return
      }

      try {
        setLoading(true)
        
        // First, try to get from sessionStorage
        const pendingTest = sessionStorage.getItem('pending-test')
        if (pendingTest) {
          const testData = JSON.parse(pendingTest)
          console.log('Loaded test from session:', testData)
          setTest(testData)
          sessionStorage.removeItem('pending-test') // Clean up
          setLoading(false)
          return
        }
        
        // If not in session, testId might be the passcode, try to call API
        console.log('Loading test from API with identifier:', testId)
        const testData = await testsApi.VerifyTestPasscode(testId)
        testData.passcode = testId
        console.log('Test data loaded:', testData)
        setTest(testData)
      } catch (err) {
        console.error('Error loading test:', err)
        setTimeout(() => navigate('/student'), 2000)
      } finally {
        setLoading(false)
      }
    }

    loadTestByPasscode()
  }, [testId, navigate])

  const handleStartTest = () => {
    if (!test) return

    // Get testId from test object or use the URL param as fallback
    const testIdentifier = test.testId || testId
    
    if (!testIdentifier) {
      console.error('No test identifier available')
      return
    }

    // Store test session info
    const sessionInfo = {
      testId: testIdentifier,
      passcode: test.passcode || testId,
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: {},
      testData: test
    }
    
    console.log('Starting test with session info:', sessionInfo)
    sessionStorage.setItem(`test-session-${testIdentifier}`, JSON.stringify(sessionInfo))

    // Navigate to test taking page
    navigate(`/student/test/${testIdentifier}/take`)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading test...</p>
        </div>
      </div>
    )
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
            <h1 className='text-xl font-bold text-foreground'>Test Information</h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto'>
          {/* Test Info Card */}
          <div className='bg-card border border-border rounded-xl p-8 mb-6'>
            <h2 className='text-3xl font-bold mb-4'>{test.title}</h2>
            {test.description && <p className='text-muted-foreground mb-6'>{test.description}</p>}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                <Clock className='h-6 w-6 text-primary' />
                <div>
                  <p className='text-sm text-muted-foreground'>Duration</p>
                  <p className='font-semibold'>{test.duration} minutes</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                <FileText className='h-6 w-6 text-primary' />
                <div>
                  <p className='text-sm text-muted-foreground'>Questions</p>
                  <p className='font-semibold'>{test.totalQuestions} questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className='bg-card border border-border rounded-xl p-8 mb-6'>
            <h3 className='text-xl font-bold mb-4'>Test Instructions</h3>
            <ul className='space-y-3 text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>You have {test.duration} minutes to complete this test.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>The timer will start immediately when you begin the test.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>You can navigate between questions using the navigation panel.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>Make sure to submit your answers before the time runs out.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-1'>•</span>
                <span>Once submitted, you cannot change your answers.</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className='flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg mb-6'>
            <AlertTriangle className='h-6 w-6 text-warning shrink-0 mt-0.5' />
            <div>
              <p className='font-semibold text-foreground mb-1'>Important</p>
              <p className='text-sm text-muted-foreground'>
                Once you start the test, the timer cannot be paused. Make sure you have a stable internet connection and
                are ready to complete the test in one sitting.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <Link
              to='/student'
              className='flex-1 px-6 py-4 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors text-center font-medium'
            >
              Cancel
            </Link>
            <button
              onClick={handleStartTest}
              className='flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium'
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeginTest
