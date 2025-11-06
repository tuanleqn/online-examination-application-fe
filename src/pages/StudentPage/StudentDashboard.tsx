import { AlertCircle, ArrowLeft, CheckCircle2, Key } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { Test } from '@/models/Test/Test'

const StudentDashboard = () => {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const isTestPage = location.pathname.includes('/test/')
  if (isTestPage) return <Outlet />

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
                    <AlertCircle className='h-5 w-5 flex-shrink-0' />
                    <p className='text-sm font-medium'>{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Tests */}
            {/* <div className='mb-8'>
              <h2 className='text-xl font-bold mb-4'>Upcoming Tests</h2>
              <div className='space-y-4'>
                {[
                  {
                    title: 'Midterm Exam',
                    subject: 'Data Structures',
                    date: '2025-02-15',
                    time: '10:00 AM',
                    duration: 90
                  },
                  { title: 'Quiz 3', subject: 'Algorithms', date: '2025-02-18', time: '2:00 PM', duration: 30 }
                ].map((test, i) => (
                  <div key={i} className='bg-card border border-border rounded-xl p-6 card-hover'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-lg mb-1'>{test.title}</h3>
                        <p className='text-sm text-muted-foreground mb-3'>{test.subject}</p>
                        <div className='flex items-center gap-4 text-sm'>
                          <div className='flex items-center gap-1 text-muted-foreground'>
                            <Calendar className='h-4 w-4' />
                            {test.date}
                          </div>
                          <div className='flex items-center gap-1 text-muted-foreground'>
                            <Clock className='h-4 w-4' />
                            {test.time}
                          </div>
                          <span className='text-muted-foreground'>{test.duration} min</span>
                        </div>
                      </div>
                      <span className='px-3 py-1 bg-warning-light text-warning text-sm font-medium rounded'>
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Recent Results */}
            <div>
              <h2 className='text-xl font-bold mb-4'>Recent Results</h2>
              <div className='space-y-4'>
                {[
                  { title: 'Quiz 2', subject: 'Data Structures', score: 85, total: 100, status: 'passed' },
                  { title: 'Assignment 1', subject: 'Algorithms', score: 72, total: 100, status: 'passed' },
                  { title: 'Quiz 1', subject: 'Data Structures', score: 58, total: 100, status: 'failed' }
                ].map((result, i) => (
                  <div key={i} className='bg-card border border-border rounded-xl p-6 card-hover'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-lg mb-1'>{result.title}</h3>
                        <p className='text-sm text-muted-foreground mb-2'>{result.subject}</p>
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl font-bold'>{result.score}</span>
                          <span className='text-muted-foreground'>/ {result.total}</span>
                          <span className='ml-2 px-2 py-1 bg-muted text-sm font-medium rounded'>
                            {Math.round((result.score / result.total) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-2'>
                        {result.status === 'passed' ? (
                          <CheckCircle2 className='h-6 w-6 text-success' />
                        ) : (
                          <AlertCircle className='h-6 w-6 text-danger' />
                        )}
                        <button className='text-sm text-primary font-medium hover:underline'>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard
