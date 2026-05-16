import { useEffect, useState } from "react";
import { useApplyStore } from "../stores/usePlaceStore"
import Modal from "../components/Modal";
import { Trash, Edit2, MapPin, DollarSign, Tag, Loader2, AlertCircle } from 'lucide-react'
import { motion } from "motion/react";

const MyPlaces = () => {
    const { fetchPlacesByUser, places, deletePlaces } = useApplyStore();
    const [open, setOpen] = useState(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    useEffect(() => {
        fetchPlacesByUser()
    }, [fetchPlacesByUser])

    const handleDeleteClick = (id) => {
        setSelectedPlaceId(id);
        setOpen(true);
    };

    if (places.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-secondary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="text-secondary-300 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900">No facilities yet</h3>
                <p className="text-secondary-500">You haven't added any places to the platform yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-secondary-400 text-sm uppercase tracking-wider">
                        <th className="px-6 py-2 font-semibold">Facility</th>
                        <th className="px-6 py-2 font-semibold">Address</th>
                        <th className="px-6 py-2 font-semibold">Price</th>
                        <th className="px-6 py-2 font-semibold">Category</th>
                        <th className="px-6 py-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {places.map((place, index) => (
                        <motion.tr 
                            key={place._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-secondary-50/50 hover:bg-secondary-50 transition-colors group"
                        >
                            <td className="px-6 py-4 rounded-l-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-secondary-200">
                                        <img 
                                            src={place.placePhoto[0] || "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=200"}
                                            alt={place.placeName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <span className="font-bold text-secondary-900">{place.placeName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-secondary-600 text-sm">
                                    <MapPin size={14} className="text-primary-500" />
                                    {place.placeAddress}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-primary-600 font-bold">
                                ${place.price}/hr
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-secondary-600 border border-secondary-200 shadow-sm uppercase tracking-wide">
                                    {place.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 rounded-r-2xl text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        onClick={() => handleDeleteClick(place._id)}
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center p-4">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-secondary-900 mb-2">Delete Facility?</h3>
                    <p className="text-secondary-500 mb-8 max-w-xs mx-auto">
                        This action cannot be undone. All reservations for this place will also be removed.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-secondary-600 bg-secondary-100 hover:bg-secondary-200 transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                            onClick={() => {
                                deletePlaces(selectedPlaceId);
                                setOpen(false);
                            }}
                        >
                            Delete Now
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MyPlaces