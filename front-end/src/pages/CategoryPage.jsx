import { useEffect } from "react";
import { useApplyStore } from "../stores/usePlaceStore";
import { useParams } from "react-router-dom";
import { motion } from "motion/react"
import { Link } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import { MapPin, Info } from "lucide-react";

const CategoryPage = () => {
    const { fetchApprovedRequest, applies } = useApplyStore()
    const { category } = useParams()

    useEffect(() => {
        fetchApprovedRequest(category);
    }, [fetchApprovedRequest, category])

    const categoryTitle = category?.charAt(0).toUpperCase() + category?.slice(1).replace(/-/g, ' ')

    return (
        <div className='bg-secondary-50 min-h-screen py-16 px-4'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-12 text-center'>
                    <h1 className='text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4'>{categoryTitle}</h1>
                    <p className='text-secondary-500 text-lg'>Discover the best {categoryTitle.toLowerCase()} near you</p>
                    <div className='w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full'></div>
                </div>

                {applies?.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center py-24 bg-white rounded-3xl border border-secondary-100'
                    >
                        <div className='text-6xl mb-4'></div>
                        <h2 className='text-2xl font-display font-bold text-secondary-900 mb-2'>No facilities found</h2>
                        <p className='text-secondary-500'>We couldn't find any listings for this category yet.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {applies?.map((apply, index) => (
                            <motion.div
                                key={apply._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/apply/${apply._id}`}>
                                    <ImageCard imgSrc={apply.placePhoto && apply.placePhoto[0]}>
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary-300 transition-colors">
                                                    {apply.placeName}
                                                </h3>
                                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold border border-white/10">
                                                    ${apply.price}/hr
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
                                                <MapPin size={14} className="text-primary-400" />
                                                <span className="truncate">{apply.placeAddress}</span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                                    <Info size={14} />
                                                    View Details
                                                </div>
                                            </div>
                                        </div>
                                    </ImageCard>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CategoryPage
