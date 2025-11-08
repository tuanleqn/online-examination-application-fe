import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus, ClipboardList, BarChart3, Users, ArrowLeft, TrendingUp, Award } from 'lucide-react'
import { testsApi } from '@/apis/tests.api'
import { performanceApi } from '@/apis/performance'
import type { Test } from '@/models/Test/Test'
import type { PerformanceSummary } from '@/models/Test/TestResult'

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'analytics'>('tests')
  const [tests, setTests] = useState<Array<Test>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [performanceData, setPerformanceData] = useState<PerformanceSummary[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  const location = useLocation()
  const isCreateTestPage = location.pathname.includes('/create-test')
  const isManageQuestionsPage = location.pathname.includes('/questions')
  const isTestResultsPage = location.pathname.includes('/results')

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

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      if (activeTab === 'analytics') {
        try {
          setAnalyticsLoading(true)
          const data = await performanceApi.getPerformanceMetrics()
          setPerformanceData(data)
          setAnalyticsError(null)
        } catch (err) {
          console.error('Error fetching performance metrics:', err)
          setAnalyticsError('Failed to load analytics data')
        } finally {
          setAnalyticsLoading(false)
        }
      }
    }

    fetchPerformanceMetrics()
  }, [activeTab])

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (performanceData.length === 0) {
      return {
        totalStudents: 0,
        activeTests: tests.filter((t) => t.status).length,
        avgScore: 0,
        totalSubmissions: 0
      }
    }

    const totalSubmissions = performanceData.reduce((sum, item) => sum + item.totalSubmissions, 0)
    const weightedAvgScore =
      performanceData.reduce((sum, item) => sum + item.averageScore * item.totalSubmissions, 0) / totalSubmissions || 0

    return {
      totalStudents: totalSubmissions, // Approximation
      activeTests: tests.filter((t) => t.status).length,
      avgScore: weightedAvgScore,
      totalSubmissions
    }
  }

  const stats = calculateOverallStats()

  if (isCreateTestPage) return <Outlet />
  if (isManageQuestionsPage) return <Outlet />
  if (isTestResultsPage) return <Outlet />

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
                      <p className='text-sm text-muted-foreground line-clamp-1'>{test.description}</p>
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
                      <span className='text-muted-foreground'>Questions:</span>
                      <span className='font-medium'>{test.questions} </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Pass Code:</span>
                      <span className='font-medium font-mono'>{test.passCode}</span>
                    </div>
                    {/* <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Start Time:</span>
                      <span className='font-medium'> {new Date(test.creator.createdAt).toLocaleDateString()}</span>
                    </div> */}
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Released Answer:</span>
                      <span className='font-medium'> {test.releasedAnswer ? 'Yes' : 'No'}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Released Score:</span>
                      <span className='font-medium'> {test.releasedScore ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className='mt-4 pt-4 border-t border-border flex gap-2'>
                    <Link
                      to={`/instructor/test/${test.testId}/results`}
                      className='flex-1 px-3 py-2 text-sm font-medium text-primary-foreground border border-primary rounded-lg  transition-colors text-center bg-primary'
                    >
                      View Results
                    </Link>
                    {/* <button className='flex-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'>
                      Edit
                    </button> */}
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
          <div className='space-y-6'>
            {/* Overall Statistics Cards */}
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Users className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Submissions</p>
                    <p className='text-2xl font-bold'>{stats.totalSubmissions}</p>
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
                    <p className='text-2xl font-bold'>{stats.activeTests}</p>
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
                    <p className='text-2xl font-bold'>{stats.avgScore.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Award className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Tests</p>
                    <p className='text-2xl font-bold'>{performanceData.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className='bg-card border border-border rounded-xl overflow-hidden'>
              <div className='p-6 border-b border-border'>
                <h2 className='text-lg font-semibold flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-primary' />
                  Test Performance Summary
                </h2>
              </div>

              {analyticsLoading ? (
                <div className='text-center py-12'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                  <p className='mt-4 text-muted-foreground'>Loading analytics...</p>
                </div>
              ) : analyticsError ? (
                <div className='text-center py-12'>
                  <p className='text-danger'>{analyticsError}</p>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
                  >
                    Retry
                  </button>
                </div>
              ) : performanceData.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-muted-foreground'>No performance data available</p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-muted/50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>Test Name</th>
                        <th className='px-6 py-3 text-center text-sm font-medium text-muted-foreground'>Submissions</th>
                        <th className='px-6 py-3 text-center text-sm font-medium text-muted-foreground'>Avg Score</th>
                        <th className='px-6 py-3 text-center text-sm font-medium text-muted-foreground'>Max Score</th>
                        <th className='px-6 py-3 text-center text-sm font-medium text-muted-foreground'>Min Score</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                      {performanceData.map((performance) => (
                        <tr key={performance.testId} className='hover:bg-muted/30 transition-colors'>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <div className='w-2 h-2 rounded-full bg-primary'></div>
                              <span className='font-medium'>{performance.testName}</span>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className='inline-flex items-center gap-1'>
                              <Users className='h-4 w-4 text-muted-foreground' />
                              {performance.totalSubmissions}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className='font-medium text-primary'>{performance.averageScore.toFixed(1)}%</span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className='font-medium text-success'>{performance.maxScore.toFixed(1)}%</span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className='font-medium text-warning'>{performance.minScore.toFixed(1)}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
