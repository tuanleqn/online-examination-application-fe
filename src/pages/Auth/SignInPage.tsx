import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { authApi } from '@/apis/auth.api'

const SignInPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authApi.signIn(email, password)
      const { token, id, userName, email: userEmail, roleId } = response.results

      localStorage.setItem('user', JSON.stringify({ id, userName, email: userEmail, roleId }))
      localStorage.setItem('authToken', token)

      if (roleId === 1 || email === 'anhtuan@gmail.com') {
        navigate('/instructor')
      } else {
        navigate('/student')
      }
    } catch (err: any) {
      setError('Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-card border border-border rounded-2xl shadow-lg p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4'>
              <LogIn className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Welcome to JoyExam</h1>
            <p className='text-muted-foreground'>Sign in to manage your tests</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg'>
              <p className='text-danger text-sm'>{error}</p>
            </div>
          )}

          {/* Sign-in Form */}
          <form onSubmit={handleSignIn} className='space-y-5'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='john@example.com'
                required
              />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-foreground mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='••••••••'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link to='/register' className='text-primary font-medium hover:underline'>
                {' '}
                Register
              </Link>
            </p>
          </div>

          {/* Back to Homepage */}
          <div className='mt-4 text-center'>
            <button onClick={() => navigate('/')} className='text-sm text-primary font-medium hover:underline'>
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
