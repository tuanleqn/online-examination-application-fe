import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const StudentDashboard = () => {
  const [passcode, setPasscode] = useState('')
  const location = useLocation()
  const isTestPage = location.pathname.includes('/test/')
  if (isTestPage) return <Outlet />

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
              <h2 className='text-2xl font-bold mb-2'>Access Test</h2>
              <p className='text-muted-foreground mb-6'>Enter the passcode provided by your instructor</p>
              <div className='flex gap-3'>
                <input
                  type='text'
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                  placeholder='Enter passcode (e.g., ABC123)'
                  className='flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg font-mono'
                  maxLength={8}
                />
                <Link
                  to='/student/test/demo-test-id'
                  className='px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity font-medium'
                >
                  Start Test
                </Link>
              </div>
            </div>

            {/* Upcoming Tests */}
            <div className='mb-8'>
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
            </div>

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
