import { useParams } from "react-router-dom"
import { useApplyStore } from "../stores/usePlaceStore"
import { useChatStore } from "../stores/useChatStore"
import { useEffect, useState } from "react"
import Reservation from "../components/Reservation";
import { MapPin, DollarSign, Info, ChevronLeft, ChevronRight, Share2, Heart, ShieldCheck, MessageSquare, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PlacePage = () => {
    const { applyId } = useParams()
    const { fetchPlacesById, applies } = useApplyStore()
    const { setSelectedUser, setChatOpen } = useChatStore()
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchPlacesById(applyId)
    }, [fetchPlacesById, applyId])

    if (!applies || applies.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-secondary-200 rounded"></div>
            </div>
        </div>
    );

    const apply = applies[0];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-secondary-50 min-h-screen py-12 px-4'
        >
            <div className='max-w-7xl mx-auto'>

                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 transition-colors font-semibold"
                    >
                        <ChevronLeft size={20} />
                        Back to Search
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">

                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-[16/10] bg-secondary-200 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={index}
                                    src={apply.placePhoto && apply.placePhoto[index]}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className='w-full h-full object-cover'
                                    alt={apply.placeName}
                                />
                            </AnimatePresence>


                            <div className="absolute top-6 left-6">
                                <span className="bg-primary-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                    <ShieldCheck size={14} />
                                    Verified Facility
                                </span>
                            </div>
                        </div>


                        <div className='flex gap-4 overflow-x-auto pb-4 no-scrollbar'>
                            {apply.placePhoto?.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${i === index
                                        ? 'border-primary-500 scale-105 shadow-lg'
                                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                                        }`}
                                >
                                    <img src={item} className='w-full h-full object-cover' alt={`Thumbnail ${i}`} />
                                    {i === index && <div className="absolute inset-0 bg-primary-500/10" />}
                                </button>
                            ))}
                        </div>


                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-secondary-100">
                            <h3 className="text-2xl font-display font-bold text-secondary-900 mb-4 flex items-center gap-3">
                                <Info className="text-primary-500" />
                                About this facility
                            </h3>
                            <p className="text-secondary-600 leading-relaxed text-lg whitespace-pre-line">
                                {apply.description || 'Experience high-quality sporting at our premium facility. Located in a convenient area with all modern amenities included.'}
                            </p>



                        </div>
                    </div>


                    <div className="lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-secondary-100 relative overflow-hidden">

                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>

                                <h1 className="text-3xl font-display font-extrabold text-secondary-900 mb-2 leading-tight">
                                    {apply.placeName}
                                </h1>
                                <div className="flex items-center gap-2 text-secondary-500 mb-6">
                                    <MapPin size={18} className="text-primary-500 flex-shrink-0" />
                                    <span className="text-sm font-medium">{apply.placeAddress}</span>
                                </div>

                                <div className="flex items-baseline gap-2 mb-8 bg-secondary-50 p-4 rounded-2xl border border-secondary-100">
                                    <span className="text-4xl font-display font-black text-primary-600">${apply.price}</span>
                                    <span className="text-secondary-500 font-bold">/ hour</span>
                                </div>

                                <div className="space-y-6">

                                    <div className="bg-secondary-50 p-6 rounded-2xl border border-secondary-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-primary-100 flex items-center justify-center">
                                                {apply.sentBy?.profilePic ? (
                                                    <img src={apply.sentBy.profilePic} alt={apply.sentBy.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="text-secondary-300 w-8 h-8" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">Facility Owner</p>
                                                <h4 className="text-lg font-bold text-secondary-900 leading-none">{apply.sentBy?.name || "Unknown Owner"}</h4>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedUser(apply.sentBy);
                                                setChatOpen(true);
                                            }}
                                            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-secondary-100 group-hover:scale-105"
                                        >
                                            <MessageSquare size={20} />
                                        </button>
                                    </div>

                                    <Reservation />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlacePage