import { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Category from './pages/CategoryOptions'
import CategoryPage from './pages/CategoryPage'
import PlacePage from './pages/PlacePage'
import Signup from './pages/Singup'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import OwnerDashboard from './pages/OwnerDashboard'
import VerifyEmail from './pages/verifyEmail'
import CheckEmail from './pages/CheckEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassowrd'
import { useUserStore } from './stores/useUserStore'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import ApplyForOwnership from './components/ApplyForPlaceForm'
import ReviewOwnerApplication from './pages/ReviewOwnerApplication'
import ChatWidget from './components/ChatWidget'

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <Toaster position="top-right" />
      <Navbar />
      <main className='min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/category' element={<Category />} />
          <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path='/user/verify-email' element={<VerifyEmail />} />
          <Route path='/user/check-email' element={<CheckEmail />} />
          <Route path='/user/forgot-password' element={<ForgotPassword />} />
          <Route path='/user/reset-password' element={<ResetPassword />} />
          <Route path='/owner-dashboard' element={user?.role === "owner" ? <OwnerDashboard /> : <Navigate to='/login' />} />
          <Route path='/profile-user/:id' element={<UserProfile />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/apply/:applyId' element={<PlacePage />} />
          <Route path='/applyform' element={<ApplyForOwnership />} />
          <Route path='/review-application/:category' element={<ReviewOwnerApplication />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  )
}

export default App
