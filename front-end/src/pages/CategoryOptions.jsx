import footbalImg from '../public/soccer.png'
import basketballImg from '../public/basketball.png'
import tenisImg from '../public/tenniscourt.png'
import CategoryItem from './CategoryItem'
import { motion } from "motion/react";

const CategoryOptions = () => {
    const categories = [
        { href: "/mini-footbal-pitches", name: "Mini Football Pitches", imageUrl: footbalImg },
        { href: "/basketball-courts", name: "Basketball Courts", imageUrl: basketballImg },
        { href: '/tenis-courts', name: 'Tennis Courts', imageUrl: tenisImg }
    ]

    return (
        <div className='bg-secondary-50 min-h-screen py-20 px-4'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-6xl font-display font-black text-secondary-900 mb-6'>
                        Explore Our <span className="text-primary-600">Categories</span>
                    </h1>
                    <p className='text-secondary-500 text-lg md:text-xl max-w-2xl mx-auto'>
                        Choose a facility type and find the perfect venue for your next game or training session.
                    </p>
                    <div className='w-24 h-1.5 bg-primary-500 mx-auto mt-10 rounded-full shadow-lg shadow-primary-500/20'></div>
                </div>

                <div className='grid md:grid-cols-3 gap-8'>
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <CategoryItem category={category} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryOptions