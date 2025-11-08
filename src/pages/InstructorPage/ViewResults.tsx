import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { testsApi } from '@/apis/tests.api'
import type { TestResultResponse } from '@/models/Test/TestResult'

const ViewResults = () => {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [testResults, setTestResults] = useState<TestResultResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testName, setTestName] = useState<string>('')

  const fetchTestResults = async () => {
    try {
      setLoading(true)
      const data = await testsApi.getTestResults(Number(testId!))
      setTestResults(data)

      if (data.length > 0) {
        setTestName(data[0].testName)
      }

      setError(null)
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (testId) {
      fetchTestResults()
    }
  }, [testId])

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-danger'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='mt-4 text-muted-foreground'>Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-muted/30 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-danger mb-4'>{error}</p>
          <button
            onClick={() => navigate('/instructor')}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      <header className='border-b border-border bg-card sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                to='/instructor'
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Back</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <div>
                <h1 className='text-xl font-bold text-foreground'>{testName}</h1>
                <p className='text-sm text-muted-foreground'>Test Results</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {testResults.length > 0 && (
          <div className='grid md:grid-cols-4 gap-4 mb-6'>
            <div className='bg-card border border-border rounded-xl p-4'>
              <p className='text-sm text-muted-foreground mb-1'>Total Submissions</p>
              <p className='text-2xl font-bold'>{testResults.length}</p>
            </div>
            <div className='bg-card border border-border rounded-xl p-4'>
              <p className='text-sm text-muted-foreground mb-1'>Average Score</p>
              <p className='text-2xl font-bold'>
                {(testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length).toFixed(1)}
                <span className='text-lg text-muted-foreground'>/{testResults[0].maxScore}</span>
              </p>
            </div>
            <div className='bg-card border border-border rounded-xl p-4'>
              <p className='text-sm text-muted-foreground mb-1'>Highest Score</p>
              <p className='text-2xl font-bold text-success'>
                {Math.max(...testResults.map((r) => r.score))}
                <span className='text-lg text-muted-foreground'>/{testResults[0].maxScore}</span>
              </p>
            </div>
            <div className='bg-card border border-border rounded-xl p-4'>
              <p className='text-sm text-muted-foreground mb-1'>Lowest Score</p>
              <p className='text-2xl font-bold text-danger'>
                {Math.min(...testResults.map((r) => r.score))}
                <span className='text-lg text-muted-foreground'>/{testResults[0].maxScore}</span>
              </p>
            </div>
          </div>
        )}

        <div className='space-y-4'>
          {testResults.map((result) => (
            <div
              key={result.studentId}
              className='bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <h3 className='font-semibold text-lg'>{result.studentName}</h3>
                  </div>
                  <p className='text-sm text-muted-foreground mb-2'>Duration: {result.duration}</p>
                  <p className='text-xs text-muted-foreground'>Total Questions: {result.totalQuestions}</p>
                </div>
                <div className='text-right flex items-center gap-6'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(result.score, result.maxScore)}`}>
                      {result.score.toFixed(1)}
                      <span className='text-lg text-muted-foreground'>/{result.maxScore}</span>
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {Math.round((result.score / result.maxScore) * 100)}%
                    </p>
                  </div>
                  <Link
                    to={`/instructor/test/${testId}/submission/${result.studentId}`}
                    className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {testResults.length === 0 && (
            <div className='text-center py-12 bg-card border border-border rounded-xl'>
              <Users className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground'>No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewResults
