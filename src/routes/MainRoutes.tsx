import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import InstructorDashboard from '@/pages/InstructorPage/InstructorDashboard'
import CreateTest from '@/pages/InstructorPage/CreateTest'
import ManageQuestions from '@/pages/InstructorPage/ManageQuestions'
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
        {/* <Route path='/' element={<HomePage />}>
          {' '}
        </Route> */}
        <Route path='/instructor' element={<InstructorDashboard />}>
          <Route path='create-test' element={<CreateTest />} />
          <Route path='test/:testId/questions' element={<ManageQuestions />} />
        </Route>
        {/* <Route path='/student' element={<StudentDashboard />}>
          <Route path='test/:testId' element={<StudentTest />} />
        </Route> */}

        {/* <Route path='/auth' element={<AuthPage />}>
          {' '}
        </Route> */}
      </Routes>
    </>
  )
}
