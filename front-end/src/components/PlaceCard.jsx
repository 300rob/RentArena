import { Link } from "react-router-dom"
import { MapPin, ArrowRight } from "lucide-react"

const PlaceCard = ({ apply }) => {
    return (
        <Link to={`/apply/${apply._id}`} className="group block h-full">
            <div className="bg-white rounded-2xl overflow-hidden border border-secondary-100 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-[4/3] bg-secondary-100 overflow-hidden">
                    <img 
                        src={apply.placePhoto[0]} 
                        alt={apply.placeName} 
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                        <p className="text-sm font-bold text-primary-600">
                            ${apply.price}<span className="text-[10px] text-secondary-500 font-normal ml-0.5">/hr</span>
                        </p>
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-display font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {apply.placeName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-secondary-500 text-sm mb-6">
                        <MapPin size={14} className="text-primary-500" />
                        <span className="truncate">{apply.placeAddress}</span>
                    </div>
                    
                    <div className='mt-auto flex items-center justify-between pt-4 border-t border-secondary-50'>
                        <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wider">Details</span>
                        <div className="bg-primary-50 text-primary-600 p-2 rounded-full group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PlaceCard