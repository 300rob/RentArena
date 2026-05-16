import { useEffect } from "react";
import { useReservationStore } from "../stores/useReservationStore"
import { Calendar, MapPin, User, Mail, Check, X, Clock, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const PlaceReservation = () => {
    const { fetchOwnPlacesReservations, acceptReservation, deleteReservation, pendingReservations } = useReservationStore();

    useEffect(() => {
        fetchOwnPlacesReservations()
    }, [fetchOwnPlacesReservations])

    if (pendingReservations.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-secondary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-secondary-300 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900">No pending requests</h3>
                <p className="text-secondary-500">When users book your facilities, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-secondary-400 text-sm uppercase tracking-wider">
                        <th className="px-6 py-2 font-semibold">User Info</th>
                        <th className="px-6 py-2 font-semibold">Facility & Address</th>
                        <th className="px-6 py-2 font-semibold">Booking Time</th>
                        <th className="px-6 py-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingReservations.map((reservation, index) => (
                        <motion.tr 
                            key={reservation._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-secondary-50/50 hover:bg-secondary-50 transition-colors"
                        >
                            <td className="px-6 py-4 rounded-l-2xl">
                                <div className="flex flex-col">
                                    <span className="font-bold text-secondary-900 flex items-center gap-2">
                                        <User size={14} className="text-primary-500" />
                                        {reservation.username}
                                    </span>
                                    <span className="text-xs text-secondary-500 flex items-center gap-2">
                                        <Mail size={12} />
                                        {reservation.email}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-secondary-800">{reservation.placeName}</span>
                                    <span className="text-xs text-secondary-500 flex items-center gap-1">
                                        <MapPin size={12} />
                                        {reservation.placeAddress}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-secondary-900 flex items-center gap-1.5">
                                        <Calendar size={14} className="text-primary-500" />
                                        {reservation.date}
                                    </span>
                                    <span className="text-xs text-secondary-600 font-semibold flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {reservation.startTime} - {reservation.endTime}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 rounded-r-2xl text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        className="p-2.5 bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95"
                                        title="Accept Reservation"
                                        onClick={() => acceptReservation(reservation._id)}
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button 
                                        className="p-2.5 bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95"
                                        title="Reject Reservation"
                                        onClick={() => deleteReservation(reservation._id)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PlaceReservation