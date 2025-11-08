import RegisterPage from '@/pages/Auth/RegisterPage'
import SignInPage from '@/pages/Auth/SignInPage'
import HomePage from '@/pages/HomePage/HomePage'
import CreateTest from '@/pages/InstructorPage/CreateTest'
import InstructorDashboard from '@/pages/InstructorPage/InstructorDashboard'
import ManageQuestions from '@/pages/InstructorPage/ManageQuestions'
import StudentSubmissionDetail from '@/pages/InstructorPage/StudentSubmissionDetail'
import ViewResults from '@/pages/InstructorPage/ViewResults'
import BeginTest from '@/pages/StudentPage/BeginTest'
import StudentDashboard from '@/pages/StudentPage/StudentDashboard'
import StudentResult from '@/pages/StudentPage/StudentResult'
import StudentTest from '@/pages/StudentPage/StudentTest'
import TestConfirmation from '@/pages/StudentPage/TestConfirmation'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function MainRoutes() {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<SignInPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route path='/instructor' element={<InstructorDashboard />}>
          <Route path='/instructor/test/:testId/results' element={<ViewResults />} />
          <Route path='create-test' element={<CreateTest />} />
          <Route path='test/questions' element={<ManageQuestions />} />
        </Route>
        <Route path='/instructor/test/:testId/submission/:studentId' element={<StudentSubmissionDetail />} />

        <Route path='/student' element={<StudentDashboard />}>
          <Route path='test/:testId/begin' element={<BeginTest />} />
          <Route path='test/:testId/take' element={<StudentTest />} />
          <Route path='test/:testId/confirmation' element={<TestConfirmation />} />
          <Route path='test/:testId/result' element={<StudentResult />} />
        </Route>
      </Routes>
    </>
  )
}
