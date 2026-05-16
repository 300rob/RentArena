import { useEffect, useState } from "react";
import { useApplyStore } from "../stores/usePlaceStore";
import { Check, X, Mail, Phone, MapPin, User, Info, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Modal from "../components/Modal";

const ReviewOwnerApplication = () => {
    const { loading, fetchPendingRequests, applies, deleteRequest, acceptRequest } = useApplyStore();
    const { category } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);

    const categoriesList = [
        { id: "mini-footbal-pitches", label: "Football" },
        { id: "basketball-courts", label: "Basketball" },
        { id: "tenis-courts", label: "Tennis" },
    ];

    useEffect(() => {
        if (category) {
            fetchPendingRequests(category);
        }
    }, [fetchPendingRequests, category]);

    const handleBack = () => navigate(-1);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-secondary-50">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            <p className="text-secondary-500 font-medium">Loading requests...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={handleBack}
                                className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1"
                            >
                                Dashboard
                            </button>
                            <span className="text-secondary-300">/</span>
                            <span className="text-sm font-bold text-secondary-500 uppercase tracking-widest">Admin Panel</span>
                        </div>
                        <h1 className="text-4xl font-display font-black text-secondary-900">
                            Review <span className="text-primary-600">Applications</span>
                        </h1>
                    </div>

                    <div className="bg-white px-6 py-3 rounded-2xl border border-secondary-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold">
                            {applies?.length || 0}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-secondary-400 uppercase tracking-tighter">Pending</p>
                            <p className="text-sm font-bold text-secondary-900">Requests</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                    {categoriesList.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/review-application/${cat.id}`)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${category === cat.id
                                ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30"
                                : "bg-white text-secondary-500 border-secondary-100 hover:border-primary-200 hover:bg-secondary-50 shadow-sm"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {!applies || applies.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-20 text-center border border-secondary-100 shadow-xl"
                    >
                        <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="text-secondary-300 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-secondary-900 mb-2">All caught up!</h3>
                        <p className="text-secondary-500 max-w-md mx-auto">There are no pending requests for this category at the moment.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {applies.map((apply, index) => (
                            <motion.div
                                key={apply._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2rem] overflow-hidden border border-secondary-100 shadow-xl flex flex-col group"
                            >
                                <div className="grid grid-cols-2 h-48 bg-secondary-100 gap-1 p-1">
                                    <div className="relative overflow-hidden rounded-tl-[1.5rem] rounded-bl-[1.5rem] cursor-zoom-in" onClick={() => setSelectedImage(apply.proofOfOwnership)}>
                                        <img src={apply.proofOfOwnership} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">Proof of Ownership</div>
                                    </div>
                                    <div className="relative overflow-hidden rounded-tr-[1.5rem] rounded-br-[1.5rem] cursor-zoom-in" onClick={() => setSelectedImage(apply.placePhoto?.[0])}>
                                        <img src={apply.placePhoto?.[0] || apply.placePhoto?.[1]} alt="Place" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">Facility Preview</div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-display font-bold text-secondary-900 leading-tight mb-1">{apply.placeName}</h3>
                                            <p className="text-secondary-500 flex items-center gap-1.5 text-sm font-medium">
                                                <MapPin size={14} className="text-primary-500" />
                                                {apply.placeAddress}
                                            </p>
                                        </div>
                                        <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100">
                                            {apply.category?.replace(/-/g, ' ')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-secondary-50 p-6 rounded-2xl border border-secondary-100">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Applicant Details</p>
                                            <div className="flex items-center gap-3 text-secondary-700">
                                                <User size={16} className="text-primary-400" />
                                                <span className="text-sm font-bold">{apply.fullName}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-secondary-700">
                                                <Mail size={16} className="text-primary-400" />
                                                <span className="text-sm font-medium">{apply.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-secondary-700">
                                                <Phone size={16} className="text-primary-400" />
                                                <span className="text-sm font-medium">{apply.phoneNumber}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Description</p>
                                            <p className="text-sm text-secondary-600 line-clamp-3 leading-relaxed italic">
                                                "{apply.description}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => acceptRequest(apply._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                        >
                                            <Check size={20} strokeWidth={3} />
                                            Approve Request
                                        </button>
                                        <button
                                            onClick={() => deleteRequest(apply._id)}
                                            className="flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white w-14 h-14 rounded-2xl font-bold border border-red-100 transition-all active:scale-95"
                                            title="Reject Application"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
                <div className="relative group max-w-4xl">
                    <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-2xl shadow-2xl" />
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black text-white rounded-xl transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ReviewOwnerApplication;