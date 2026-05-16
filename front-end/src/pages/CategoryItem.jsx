import { Link } from 'react-router-dom'
import ImageCard from '../components/ImageCard'

const CategoryItem = ({ category }) => {
    return (
        <Link to={'/category' + category.href} className='no-underline'>
            <ImageCard imgSrc={category.imageUrl}>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">{category.name}</h3>
                <p className="text-white/70 text-sm mt-1">Explore {category.name} →</p>
            </ImageCard>
        </Link>
    )
}

export default CategoryItem