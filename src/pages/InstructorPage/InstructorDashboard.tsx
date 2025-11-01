import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus, ClipboardList, BarChart3, Users, ArrowLeft } from 'lucide-react'

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'analytics'>('tests')
  const location = useLocation()
  const isCreateTestPage = location.pathname.includes('/create-test')
  const isManageQuestionsPage = location.pathname.includes('/questions')

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
        {activeTab === activeTab ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Sample Test Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className='bg-card border border-border rounded-xl p-6 card-hover'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='font-semibold text-lg mb-1'>Sample Test {i}</h3>
                    <p className='text-sm text-muted-foreground'>CS101 - Data Structures</p>
                  </div>
                  <span className='px-2 py-1 bg-success-light text-success text-xs font-medium rounded'>Active</span>
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Duration:</span>
                    <span className='font-medium'>60 minutes</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Questions:</span>
                    <span className='font-medium'>20</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Submissions:</span>
                    <span className='font-medium'>45</span>
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
