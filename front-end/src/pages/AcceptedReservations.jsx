import { useReservationStore } from '../stores/useReservationStore'
import { useEffect } from 'react';
import { Calendar, MapPin, User, Mail, Clock, CheckCircle2, Search } from "lucide-react";
import { motion } from "motion/react";

const AcceptedReservations = () => {
    const { acceptedReservations, fetchAcceptedReservations } = useReservationStore();

    useEffect(() => {
        fetchAcceptedReservations()
    }, [fetchAcceptedReservations])

    if (acceptedReservations.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-secondary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-secondary-300 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900">No active bookings</h3>
                <p className="text-secondary-500">Accepted reservations will show up here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    Confirmed Reservations
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search reservations..." 
                        className="pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-secondary-400 text-sm uppercase tracking-wider">
                            <th className="px-6 py-2 font-semibold">Guest</th>
                            <th className="px-6 py-2 font-semibold">Venue</th>
                            <th className="px-6 py-2 font-semibold">Schedule</th>
                            <th className="px-6 py-2 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acceptedReservations.map((reservation, index) => (
                            <motion.tr 
                                key={reservation._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border border-secondary-100 hover:shadow-md transition-all group"
                            >
                                <td className="px-6 py-5 rounded-l-2xl border-y border-l border-secondary-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                            {reservation.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-secondary-900">{reservation.username}</span>
                                            <span className="text-xs text-secondary-500">{reservation.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-y border-secondary-100">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-secondary-800">{reservation.placeName}</span>
                                        <span className="text-xs text-secondary-500 flex items-center gap-1">
                                            <MapPin size={12} />
                                            {reservation.placeAddress}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-y border-secondary-100">
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
                                <td className="px-6 py-5 rounded-r-2xl border-y border-r border-secondary-100">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Confirmed
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AcceptedReservations;