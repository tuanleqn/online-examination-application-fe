import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const TestConfirmation = () => {
  return (
    <div className='min-h-screen bg-muted/30 flex items-center justify-center p-4'>
      <div className='bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300'>
        <div className='mb-6 flex justify-center'>
          <div className='w-20 h-20 rounded-full bg-success/10 flex items-center justify-center'>
            <CheckCircle2 className='h-12 w-12 text-success' />
          </div>
        </div>

        <h1 className='text-2xl font-bold text-foreground mb-3'>Test Submitted Successfully!</h1>
        <p className='text-muted-foreground mb-2'>Your answers have been submitted and saved.</p>
        <p className='text-sm text-muted-foreground mb-8'>
          You will receive your results once the instructor has graded your test.
        </p>

        <div className='bg-muted/50 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-between text-sm mb-2'>
            <span className='text-muted-foreground'>Test:</span>
            <span className='font-semibold text-foreground'>Midterm Exam - Data Structures</span>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Submitted at:</span>
            <span className='font-semibold text-foreground'>{new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <Link
            to='/student'
            className='w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium'
          >
            Back to Dashboard
          </Link>
          <Link
            to='/'
            className='w-full px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors font-medium'
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TestConfirmation
