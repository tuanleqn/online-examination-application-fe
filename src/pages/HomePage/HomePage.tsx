import { ArrowRight, BarChart3, ClipboardList, Clock, GraduationCap, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import './index.css'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-2'>
            <GraduationCap className='h-8 w-8 text-primary' />
            <h1 className='text-2xl font-bold text-foreground'>JoyExam</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent'>
            Online Examination Platform
          </h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            A comprehensive solution for creating, managing, and taking online exams with real-time grading and
            analytics
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          {/* Instructor Card */}
          <Link
            to='/login'
            className='group relative overflow-hidden rounded-2xl bg-card border border-border p-8 card-hover'
          >
            <div className='absolute inset-0 bg-instructor-gradient opacity-5 group-hover:opacity-10 transition-opacity' />
            <div className='relative'>
              <div className='w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6'>
                <ClipboardList className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-2xl font-bold mb-3 text-foreground'>Instructor Portal</h3>
              <p className='text-muted-foreground mb-6'>
                Create and manage tests, review submissions, and analyze performance metrics
              </p>
              <div className='flex items-center text-primary font-medium group-hover:gap-2 transition-all'>
                Get Started
                <ArrowRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
              </div>
            </div>
          </Link>

          {/* Student Card */}
          <Link
            to='/login'
            className='group relative overflow-hidden rounded-2xl bg-card border border-border p-8 card-hover'
          >
            <div className='absolute inset-0 bg-student-gradient opacity-5 group-hover:opacity-10 transition-opacity' />
            <div className='relative'>
              <div className='w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center mb-6'>
                <GraduationCap className='h-8 w-8 text-success' />
              </div>
              <h3 className='text-2xl font-bold mb-3 text-foreground'>Student Portal</h3>
              <p className='text-muted-foreground mb-6'>
                Access your exams, take tests with timer, and view your results and feedback
              </p>
              <div className='flex items-center text-success font-medium group-hover:gap-2 transition-all'>
                Get Started
                <ArrowRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className='mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
          <div className='text-center p-6'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4'>
              <Clock className='w-6 h-6 text-blue-600' />
            </div>
            <h4 className='font-semibold mb-2'>Real-time Timer</h4>
            <p className='text-sm text-muted-foreground'>Color-coded countdown with auto-submit</p>
          </div>
          <div className='text-center p-6'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4'>
              <Save className='w-6 h-6 text-green-600' />
            </div>
            <h4 className='font-semibold mb-2'>Auto-save</h4>
            <p className='text-sm text-muted-foreground'>Never lose your progress</p>
          </div>
          <div className='text-center p-6'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4'>
              <BarChart3 className='w-6 h-6 text-yellow-600' />
            </div>
            <h4 className='font-semibold mb-2'>Analytics Dashboard</h4>
            <p className='text-sm text-muted-foreground'>Comprehensive performance insights</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-border mt-20 py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          <p>© 2025 JoyExam. </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
