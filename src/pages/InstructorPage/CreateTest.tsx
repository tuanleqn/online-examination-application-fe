import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Save } from 'lucide-react'
import { testsApi } from '@/apis/tests.api'

const CreateTest = () => {
  console.log('API Base URL:', import.meta.env.VITE_BE_API_BASE_URL)
  console.log(testsApi.getAllTests())
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    startTime: '',
    endTime: '',
    className: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime)
      const end = new Date(formData.endTime)
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Create test object
    const newTest = {
      id: `test-${Date.now()}`,
      title: formData.title,
      duration: parseInt(formData.duration),
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      className: formData.className || 'Unassigned',
      passcode: '',
      questions: [],
      status: 'draft' as const,
      createdBy: 'instructor-1',
      createdAt: new Date()
    }

    // Save to localStorage (mock database)
    const tests = JSON.parse(localStorage.getItem('tests') || '[]')
    tests.push(newTest)
    localStorage.setItem('tests', JSON.stringify(tests))

    // Redirect to manage questions
    navigate(`/instructor/test/${newTest.id}/questions`)
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-4'>
            <Link
              to='/instructor'
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-5 w-5' />
              <span>Back to Dashboard</span>
            </Link>
            <div className='h-6 w-px bg-border' />
            <h1 className='text-xl font-bold text-foreground'>Create New Test</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <form onSubmit={handleSubmit} className='bg-card border border-border rounded-xl p-8 space-y-6'>
            {/* Title */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-foreground mb-2'>
                Test Title <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='e.g., Midterm Exam - Data Structures'
                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.title ? 'border-danger' : 'border-border'
                }`}
              />
              {errors.title && <p className='mt-1 text-sm text-danger'>{errors.title}</p>}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor='duration' className='block text-sm font-medium text-foreground mb-2'>
                Duration (minutes) <span className='text-danger'>*</span>
              </label>
              <div className='relative'>
                <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <input
                  type='number'
                  id='duration'
                  name='duration'
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder='60'
                  min='1'
                  className={`w-full pl-12 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.duration ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.duration && <p className='mt-1 text-sm text-danger'>{errors.duration}</p>}
            </div>

            {/* Time Window */}
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='startTime' className='block text-sm font-medium text-foreground mb-2'>
                  Start Time <span className='text-danger'>*</span>
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <input
                    type='datetime-local'
                    id='startTime'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.startTime ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.startTime && <p className='mt-1 text-sm text-danger'>{errors.startTime}</p>}
              </div>

              <div>
                <label htmlFor='endTime' className='block text-sm font-medium text-foreground mb-2'>
                  End Time <span className='text-danger'>*</span>
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <input
                    type='datetime-local'
                    id='endTime'
                    name='endTime'
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.endTime ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.endTime && <p className='mt-1 text-sm text-danger'>{errors.endTime}</p>}
              </div>
            </div>

            {/* Class Name */}
            <div>
              <label htmlFor='className' className='block text-sm font-medium text-foreground mb-2'>
                Class Name <span className='text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='text'
                id='className'
                name='className'
                value={formData.className}
                onChange={handleChange}
                placeholder='e.g., CS101 - Section A'
                className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors'
              />
            </div>

            {/* Submit Button */}
            <div className='flex gap-4 pt-4'>
              <button
                type='button'
                onClick={() => navigate('/instructor/dashboard')}
                className='flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
              >
                <Save className='h-5 w-5' />
                Create & Add Questions
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTest
