import { AlertCircle, ArrowLeft, CheckCircle2, Key } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { Test } from '@/models/Test/Test'
import type { TestResultResponse } from '@/models/Test/TestResult'
import { testsApi } from '@/apis/tests.api'

const StudentDashboard = () => {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [recentResults, setRecentResults] = useState<TestResultResponse[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const isTestPage = location.pathname.includes('/test/')
  const isStudenResultPage = location.pathname.includes('/result')

  // Fetch student's test results
  useEffect(() => {
    const fetchStudentTests = async () => {
      try {
        setLoading(true)
        
        // Get student ID from localStorage
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          console.error('User not found in localStorage')
          setLoading(false)
          return
        }
        
        const user = JSON.parse(userStr)
        const studentId = user.id
        
        const results = await testsApi.getTestsByStudentId(studentId)
        setRecentResults(results)
      } catch (error) {
        console.error('Error fetching student tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentTests()
  }, [])

  if (isTestPage) return <Outlet />
  if (isStudenResultPage) return <Outlet />

  const handleAccessTest = () => {
    setError('')

    if (!passcode.trim()) {
      setError('Please enter a passcode.')
      return
    }

    // Get all tests from localStorage
    const tests: Test[] = JSON.parse(localStorage.getItem('tests') || '[]')

    // Find test with matching passcode
    const test = tests.find((t) => t.title === passcode.trim())

    if (!test) {
      // setError('Invalid passcode.')
      // return
    }

    // Check time window
    // const now = new Date()
    // const startTime = new Date(test.startTime)
    // const endTime = new Date(test.endTime)

    // if (now < startTime) {
    //   // setError('Test has not opened yet.')
    //   // return
    // }

    // if (now > endTime) {
    //   setError('Test is closed.')
    //   return
    // }

    // Passcode valid and within time window - navigate to begin test page
    navigate(`/student/test/${213}/begin`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAccessTest()
    }
  }

  return (
    <>
      <div className='min-h-screen bg-muted/30'>
        {/* Header */}
        <header className='border-b border-border bg-card'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center gap-4'>
              <Link
                to='/'
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Home</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <h1 className='text-xl font-bold text-foreground'>Student Dashboard</h1>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            {/* Access Test Section */}
            <div className='bg-card border border-border rounded-xl p-8 mb-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <Key className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold'>Access Test</h2>
                  <p className='text-muted-foreground'>Enter the passcode provided by your instructor</p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex gap-3'>
                  <input
                    type='text'
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value.toString())
                      setError('')
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder='Enter passcode (e.g., AbC12345)'
                    className='flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-mono'
                    maxLength={8}
                  />
                  <button
                    onClick={handleAccessTest}
                    className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium'
                  >
                    Access Test
                  </button>
                </div>
                {error && (
                  <div className='flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/20 text-danger rounded-lg'>
                    <AlertCircle className='h-5 w-5 shrink-0' />
                    <p className='text-sm font-medium'>{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Results */}
            <div>
              <h2 className='text-xl font-bold mb-4'>Recent Results</h2>
              {loading ? (
                <div className='bg-card border border-border rounded-xl p-8 text-center'>
                  <p className='text-muted-foreground'>Loading results...</p>
                </div>
              ) : recentResults.length === 0 ? (
                <div className='bg-card border border-border rounded-xl p-8 text-center'>
                  <p className='text-muted-foreground'>No test results yet</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {recentResults.map((result, i) => {
                    const percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0
                    const isPassed = percentage >= 50 // You can adjust this threshold

                    return (
                      <div key={i} className='bg-card border border-border rounded-xl p-6 card-hover'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <h3 className='font-semibold text-lg mb-1'>{result.testName}</h3>
                            <p className='text-sm text-muted-foreground mb-2'>
                              Duration: {result.duration} • Questions: {result.totalQuestions}
                            </p>
                            <div className='flex items-center gap-2'>
                              {result.releasedScore ? (
                                <>
                                  <span className='text-2xl font-bold'>{result.score}</span>
                                  <span className='text-muted-foreground'>/ {result.maxScore}</span>
                                  <span className='ml-2 px-2 py-1 bg-muted text-sm font-medium rounded'>
                                    {percentage}%
                                  </span>
                                </>
                              ) : (
                                <span className='text-sm text-muted-foreground italic'>Score not released yet</span>
                              )}
                            </div>
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            {result.releasedScore &&
                              (isPassed ? (
                                <CheckCircle2 className='h-6 w-6 text-success' />
                              ) : (
                                <AlertCircle className='h-6 w-6 text-danger' />
                              ))}
                            {result.releasedAnswer && (
                              <Link
                                to={`/student/test/${result.testId}/result`}
                                className='text-sm text-primary font-medium hover:underline'
                              >
                                View Details
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard
