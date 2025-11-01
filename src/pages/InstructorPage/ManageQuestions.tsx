import type { Question } from '@/models/Test/Question'
import type { Test } from '@/models/Test/Test'
import { ArrowLeft, Check, Copy, Edit2, Key, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ManageQuestions = () => {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [copied, setCopied] = useState(false)

  const [questionType, setQuestionType] = useState<'mcq' | 'true-false'>('mcq')
  const [formData, setFormData] = useState({
    text: '',
    options: ['', ''],
    correctAnswer: 0,
    points: 1
  })

  // Edit state: when editingId is set, editFormData holds the working values
  const [editQuestionType, setEditQuestionType] = useState<'mcq' | 'true-false'>('mcq')
  const [editFormData, setEditFormData] = useState({
    text: '',
    options: ['', ''],
    correctAnswer: 0,
    points: 1
  })

  useEffect(() => {
    // Load test from localStorage
    const tests = JSON.parse(localStorage.getItem('tests') || '[]')
    const foundTest = tests.find((t: Test) => t.id === testId)
    if (foundTest) {
      setTest(foundTest)
      setPasscode(foundTest.passcode || '')
      // Load questions
  const storedQuestions = JSON.parse(localStorage.getItem(`questions-${testId}`) || '[]')
      setQuestions(storedQuestions)
    } else {
      navigate('/instructor')
    }
  }, [testId, navigate])

  const generatePasscode = () => {
    // Generate 8-character alphanumeric passcode
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding confusing characters
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPasscode(code)

    // Update test in localStorage
    const tests = JSON.parse(localStorage.getItem('tests') || '[]')
    const updatedTests = tests.map((t: Test) => (t.id === testId ? { ...t, passcode: code } : t))
    localStorage.setItem('tests', JSON.stringify(updatedTests))
  }

  const copyPasscode = () => {
    navigator.clipboard.writeText(passcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addOption = () => {
    if (formData.options.length < 4) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ''] }))
    }
  }

  // Edit-specific option handlers
  const addEditOption = () => {
    if (editFormData.options.length < 4) {
      setEditFormData((prev) => ({ ...prev, options: [...prev.options, ''] }))
    }
  }

  const removeEditOption = (index: number) => {
    if (editFormData.options.length > 2) {
      setEditFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer:
          prev.correctAnswer === index ? 0 : prev.correctAnswer > index ? prev.correctAnswer - 1 : prev.correctAnswer
      }))
    }
  }

  const handleEditOptionChange = (index: number, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt))
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer:
          prev.correctAnswer === index ? 0 : prev.correctAnswer > index ? prev.correctAnswer - 1 : prev.correctAnswer
      }))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt))
    }))
  }

  const handleAddQuestion = () => {
    // Validation based on question type
    if (!formData.text.trim()) {
      alert('Please enter the question text')
      return
    }

    if (questionType === 'mcq' && formData.options.some((opt) => !opt.trim())) {
      alert('Please fill in all options')
      return
    }

    let newQuestion: Question

    if (questionType === 'mcq') {
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'mcq',
        text: formData.text,
        options: formData.options,
        correctAnswer: formData.options[formData.correctAnswer],
        points: formData.points
      }
    } else {
      // true-false
      newQuestion = {
        id: `q-${Date.now()}`,
        type: 'true-false',
        text: formData.text,
        options: ['True', 'False'],
        correctAnswer: formData.correctAnswer === 0 ? 'True' : 'False',
        points: formData.points
      }
    }

    const updated = [...questions, newQuestion]
    setQuestions(updated)
  localStorage.setItem(`questions-${testId}`, JSON.stringify(updated))

    // Reset form
    setFormData({ text: '', options: ['', ''], correctAnswer: 0, points: 1 })
    setQuestionType('mcq')
    setShowAddForm(false)
  }

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updated = questions.filter((q) => q.id !== id)
      setQuestions(updated)
  localStorage.setItem(`questions-${testId}`, JSON.stringify(updated))
    }
  }

  // Start editing a question: prefill editFormData
  const startEdit = (q: Question) => {
    setEditingId(q.id)
    setEditQuestionType(q.type === 'mcq' ? 'mcq' : 'true-false')
    setEditFormData({
      text: q.text,
      options: q.options && q.options.length ? [...q.options] : q.type === 'true-false' ? ['True', 'False'] : ['', ''],
      correctAnswer: q.options ? Math.max(0, q.options.indexOf(String(q.correctAnswer))) : 0,
      points: q.points ?? 1
    })
    // close add form if open
    setShowAddForm(false)
  }

  const saveEdit = () => {
    if (!editFormData.text.trim()) {
      alert('Please enter the question text')
      return
    }
    if (editQuestionType === 'mcq' && editFormData.options.some((opt) => !opt.trim())) {
      alert('Please fill in all options')
      return
    }

    const updatedQuestions = questions.map((q) => {
      if (q.id !== editingId) return q
      if (editQuestionType === 'mcq') {
        return {
          ...q,
          type: 'mcq',
          text: editFormData.text,
          options: editFormData.options,
          correctAnswer: editFormData.options[editFormData.correctAnswer],
          points: editFormData.points
        }
      } else {
        return {
          ...q,
          type: 'true-false',
          text: editFormData.text,
          options: ['True', 'False'],
          correctAnswer: editFormData.correctAnswer === 0 ? 'True' : 'False',
          points: editFormData.points
        }
      }
    })
    const typedUpdated = updatedQuestions as Question[]

    setQuestions(typedUpdated)
  localStorage.setItem(`questions-${testId}`, JSON.stringify(typedUpdated))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const submitTest = () => {
    if (!questions || questions.length === 0) {
      alert('Please add at least one question before submitting the test.')
      return
    }

    // Update tests entry in localStorage to include questions and mark published
    const tests = JSON.parse(localStorage.getItem('tests') || '[]') as Test[]
    const updatedTests = tests.map((t: Test) => (t.id === testId ? { ...t, questions, published: true } : t))
    localStorage.setItem('tests', JSON.stringify(updatedTests))

  // update local state (avoid strict Test typing for added fields)
  setTest((prev) => (prev ? ({ ...prev, questions, published: true } as any) : prev))

    alert('Test submitted successfully.')
  }

  if (!test) return null

  return (
    <div className='min-h-screen bg-muted/30'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                to='/instructor'
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Dashboard</span>
              </Link>
              <div className='h-6 w-px bg-border' />
              <div>
                <h1 className='text-xl font-bold text-foreground'>{test.title}</h1>
                <p className='text-sm text-muted-foreground'>Manage Questions</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setShowAddForm(true)}
                className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
              >
                <Plus className='h-4 w-4' />
                Add Question
              </button>
              <button
                onClick={() => submitTest()}
                className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Passcode Section */}
        <div className='bg-card border border-border rounded-xl p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center'>
                <Key className='h-5 w-5 text-warning' />
              </div>
              <div>
                <h3 className='font-semibold text-foreground'>Test Passcode</h3>
                <p className='text-sm text-muted-foreground'>Students need this to access the test</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              {passcode ? (
                <>
                  <div className='px-4 py-2 bg-muted rounded-lg font-mono text-lg font-bold text-foreground'>
                    {passcode}
                  </div>
                  <button
                    onClick={copyPasscode}
                    className='flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors'
                  >
                    {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </>
              ) : (
                <button
                  onClick={generatePasscode}
                  className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
                >
                  <Key className='h-4 w-4' />
                  Generate Passcode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <div className='bg-card border border-border rounded-xl p-6 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-foreground'>Add New Question</h3>
              <button onClick={() => setShowAddForm(false)} className='text-muted-foreground hover:text-foreground'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='space-y-4'>
              {/* Question Type Selector */}
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'true-false')}
                  className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  <option value='mcq'>Single Choice (chọn 1 đáp án)</option>
                  <option value='true-false'>True/False (Đúng/Sai)</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Question Text</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder='Enter your question...'
                  rows={3}
                  className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none'
                />
              </div>

              {/* Multiple Choice Options */}
              {questionType === 'mcq' && (
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm font-medium text-foreground'>Answer Options (2-4)</label>
                    {formData.options.length < 4 && (
                      <button
                        onClick={addOption}
                        className='text-sm text-primary hover:text-primary-hover font-medium'
                      >
                        + Add Option
                      </button>
                    )}
                  </div>
                  <div className='space-y-2'>
                    {formData.options.map((option, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <input
                          type='radio'
                          name='correctAnswer'
                          checked={formData.correctAnswer === index}
                          onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: index }))}
                          className='w-4 h-4 text-primary'
                        />
                        <input
                          type='text'
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className='flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                        {formData.options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className='p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* True/False Options */}
              {questionType === 'true-false' && (
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>Correct Answer</label>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='trueFalseAnswer'
                        checked={formData.correctAnswer === 0}
                        onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: 0 }))}
                        className='w-4 h-4 text-primary'
                      />
                      <label className='px-4 py-2 bg-background border border-border rounded-lg flex-1'>True</label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='trueFalseAnswer'
                        checked={formData.correctAnswer === 1}
                        onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: 1 }))}
                        className='w-4 h-4 text-primary'
                      />
                      <label className='px-4 py-2 bg-background border border-border rounded-lg flex-1'>False</label>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Points</label>
                <input
                  type='number'
                  min='1'
                  value={formData.points}
                  onChange={(e) => setFormData((prev) => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                  className='w-32 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setShowAddForm(false)}
                  className='flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className='flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className='space-y-4'>
          {questions.length === 0 ? (
            <div className='bg-card border-2 border-dashed border-border rounded-xl p-12 text-center'>
              <p className='text-muted-foreground mb-4'>No questions added yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
              >
                <Plus className='h-5 w-5' />
                Add Your First Question
              </button>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded'>
                        Q{index + 1}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          question.type === 'mcq'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {question.type === 'mcq' ? 'Single Choice' : 'True/False'}
                      </span>
                      <span className='text-sm text-muted-foreground'>{question.points} points</span>
                    </div>
                    <p className='text-foreground font-medium'>{question.text}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => startEdit(question)}
                      className='p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors'
                    >
                      <Edit2 className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className='p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                {/* Inline edit form when editing this question, otherwise show options */}
                {editingId === question.id ? (
                  <div className='mt-4 space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>Question Type</label>
                      <select
                        value={editQuestionType}
                        onChange={(e) => setEditQuestionType(e.target.value as 'mcq' | 'true-false')}
                        className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                      >
                        <option value='mcq'>Single Choice (chọn 1 đáp án)</option>
                        <option value='true-false'>True/False (Đúng/Sai)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>Question Text</label>
                      <textarea
                        value={editFormData.text}
                        onChange={(e) => setEditFormData((prev) => ({ ...prev, text: e.target.value }))}
                        rows={3}
                        className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none'
                      />
                    </div>

                    {editQuestionType === 'mcq' && (
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='block text-sm font-medium text-foreground'>Answer Options (2-4)</label>
                          {editFormData.options.length < 4 && (
                            <button onClick={addEditOption} className='text-sm text-primary hover:text-primary-hover font-medium'>
                              + Add Option
                            </button>
                          )}
                        </div>
                        <div className='space-y-2'>
                          {editFormData.options.map((option, idx) => (
                            <div key={idx} className='flex items-center gap-2'>
                              <input
                                type='radio'
                                name={`correct-${question.id}`}
                                checked={editFormData.correctAnswer === idx}
                                onChange={() => setEditFormData((prev) => ({ ...prev, correctAnswer: idx }))}
                                className='w-4 h-4 text-primary'
                              />
                              <input
                                type='text'
                                value={option}
                                onChange={(e) => handleEditOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                className='flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                              />
                              {editFormData.options.length > 2 && (
                                <button onClick={() => removeEditOption(idx)} className='p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors'>
                                  <Trash2 className='h-4 w-4' />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {editQuestionType === 'true-false' && (
                      <div>
                        <label className='block text-sm font-medium text-foreground mb-2'>Correct Answer</label>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <input
                              type='radio'
                              name={`tf-${question.id}`}
                              checked={editFormData.correctAnswer === 0}
                              onChange={() => setEditFormData((prev) => ({ ...prev, correctAnswer: 0 }))}
                              className='w-4 h-4 text-primary'
                            />
                            <label className='px-4 py-2 bg-background border border-border rounded-lg flex-1'>True</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input
                              type='radio'
                              name={`tf-${question.id}`}
                              checked={editFormData.correctAnswer === 1}
                              onChange={() => setEditFormData((prev) => ({ ...prev, correctAnswer: 1 }))}
                              className='w-4 h-4 text-primary'
                            />
                            <label className='px-4 py-2 bg-background border border-border rounded-lg flex-1'>False</label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>Points</label>
                      <input
                        type='number'
                        min='1'
                        value={editFormData.points}
                        onChange={(e) => setEditFormData((prev) => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                        className='w-32 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                      />
                    </div>

                    <div className='flex gap-3 pt-2'>
                      <button onClick={cancelEdit} className='flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors'>
                        Cancel
                      </button>
                      <button onClick={saveEdit} className='flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  question.options && (
                    <div className='space-y-2 mt-4'>
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                            option === question.correctAnswer ? 'bg-success/10 border border-success/20' : 'bg-muted/30'
                          }`}
                        >
                          <span className='text-sm text-muted-foreground font-medium'>
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className='text-sm text-foreground'>{option}</span>
                          {option === question.correctAnswer && <Check className='h-4 w-4 text-success ml-auto' />}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageQuestions