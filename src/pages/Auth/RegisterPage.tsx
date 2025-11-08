import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { authApi } from '@/apis/auth.api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    profileImg: '',
    roleId: 2 // Default to student role
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authApi.register(
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.password,
        formData.profileImg,
        formData.roleId
      )
      console.log('Registration successful:', response)
      navigate('/login')
    } catch (err: any) {
      setError('Registration failed. Please try again.')
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
              <UserPlus className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Create Account</h1>
            <p className='text-muted-foreground'>Sign up to start creating tests</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg'>
              <p className='text-danger text-sm'>{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className='space-y-5'>
            <div>
              <label htmlFor='fullName' className='block text-sm font-medium text-foreground mb-2'>
                Full Name
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='John Doe'
                required
              />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='john@example.com'
                required
              />
            </div>
            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-foreground mb-2'>
                Phone Number
              </label>
              <input
                type='text'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='123-456-7890'
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
                name='password'
                value={formData.password}
                onChange={handleChange}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link to='/login' className='text-primary font-medium hover:underline'>
                {' '}
                Login
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

export default RegisterPage
