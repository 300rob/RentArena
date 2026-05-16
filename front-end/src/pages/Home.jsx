import { Link } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const Home = () => {
  const { user } = useUserStore()

  return (
    <div className='flex flex-col min-h-screen bg-gray-800'>
      <section className='relative h-[80vh] flex items-center overflow-hidden'>
        <div className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white'>
          <div className='max-w-3xl'>
            <h1 className='text-5xl md:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in'>
              Elevate Your <span className='text-primary-400'>Game</span>
            </h1>
            <p className='text-xl md:text-2xl text-secondary-100 mb-10 max-w-2xl leading-relaxed'>
              The ultimate platform to discover, book, and enjoy premium sports facilities. Whether it's a court, pitch, or arena, we bring the game to you.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/category'
                className='bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-bold  flex items-center justify-center'
              >
                Browse Facilities
              </Link>
              {!user && (
                <Link
                  to='/signup'
                  className='bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center'
                >
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
