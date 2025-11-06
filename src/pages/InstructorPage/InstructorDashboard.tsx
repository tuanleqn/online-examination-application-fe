import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus, ClipboardList, BarChart3, Users, ArrowLeft } from 'lucide-react'
import { testsApi } from '@/apis/tests.api'

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'analytics'>('tests')
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const isCreateTestPage = location.pathname.includes('/create-test')
  const isManageQuestionsPage = location.pathname.includes('/questions')

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const data = await testsApi.getAllTests()
        setTests(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching tests:', err)
        setError('Failed to load tests')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  if (isCreateTestPage) return <Outlet />
  if (isManageQuestionsPage) return <Outlet />

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                to='/'
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Home</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <h1 className='text-xl font-bold text-foreground'>Instructor Dashboard</h1>
            </div>
            <Link
              to='/instructor/create-test'
              className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
            >
              <Plus className='h-4 w-4' />
              Create Test
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Tabs */}
        <div className='flex gap-2 mb-6 border-b border-border'>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'tests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ClipboardList className='h-4 w-4' />
            My Tests
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className='h-4 w-4' />
            Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'tests' ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Loading State */}
            {loading && (
              <div className='col-span-full text-center py-12'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                <p className='mt-4 text-muted-foreground'>Loading tests...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className='col-span-full text-center py-12'>
                <p className='text-danger'>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
                >
                  Retry
                </button>
              </div>
            )}

            {/* Test Cards */}
            {!loading &&
              !error &&
              tests.map((test) => (
                <div key={test.testId} className='bg-card border border-border rounded-xl p-6 card-hover'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='font-semibold text-lg mb-1'>{test.title}</h3>
                      <p className='text-sm text-muted-foreground'>{test.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        test.status ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {test.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Duration:</span>
                      <span className='font-medium'>{test.duration} minutes</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Pass Code:</span>
                      <span className='font-medium font-mono'>{test.passCode}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Start Time:</span>
                      <span className='font-medium'>{new Date(test.startTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className='mt-4 pt-4 border-t border-border flex gap-2'>
                    <button className='flex-1 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors'>
                      View Results
                    </button>
                    <button className='flex-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'>
                      Edit
                    </button>
                  </div>
                </div>
              ))}

            {/* Create New Card */}
            {!loading && !error && (
              <Link
                to='/instructor/create-test'
                className='bg-muted/50 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-colors'
              >
                <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Plus className='h-6 w-6 text-primary' />
                </div>
                <div className='text-center'>
                  <p className='font-medium text-foreground mb-1'>Create New Test</p>
                  <p className='text-sm text-muted-foreground'>Start from scratch</p>
                </div>
              </Link>
            )}
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Analytics Cards */}
            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Students</p>
                  <p className='text-2xl font-bold'>142</p>
                </div>
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center'>
                  <ClipboardList className='h-5 w-5 text-success' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Active Tests</p>
                  <p className='text-2xl font-bold'>8</p>
                </div>
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center'>
                  <BarChart3 className='h-5 w-5 text-warning' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Avg. Score</p>
                  <p className='text-2xl font-bold'>78%</p>
                </div>
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <ClipboardList className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Submissions</p>
                  <p className='text-2xl font-bold'>456</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
