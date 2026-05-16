import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const Navbar = () => {
  const { user, onlineUsers, logout } = useUserStore()
  const navigate = useNavigate()

  const isOwner = user?.role === "owner"
  const isAdmin = user?.role === "admin"

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-secondary-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center gap-2'>
              <span className='text-xl font-display font-bold text-primary-600 hidden sm:block'>RentArena</span>
            </Link>
          </div>

          <div className='flex items-center gap-6'>
            {user ? (
              <>
                <div className='hidden md:flex items-center gap-6'>
                  {isAdmin && (
                    <Link to='/review-application/mini-footbal-pitches' className='text-emerald-600 hover:text-emerald-700 transition-colors font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100'>
                      Admin Panel
                    </Link>
                  )}
                  {isOwner ? (
                    <Link to='/owner-dashboard' className='text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm'>
                      Dashboard
                    </Link>
                  ) : (
                    <Link to='/applyForm' className='text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm'>
                      Become an Owner
                    </Link>
                  )}
                  <Link to={`/profile-user/${user.userId || user._id}`} className='text-secondary-600 hover:text-primary-600 transition-colors font-medium text-sm'>
                    My Profile
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className='bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg transition-all font-semibold text-sm border border-primary-100'
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to='/login'
                className='bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg transition-all font-semibold text-sm shadow-sm hover:shadow-md'
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
