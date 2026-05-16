import { useState, useEffect, useMemo } from "react"
import MyPlaces from "./MyPlaces";
import PlaceReservation from "./PlaceReservation";
import AcceptedReservations from "./AcceptedReservations";
import { LayoutDashboard, MapPin, CalendarCheck, CheckCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useReservationStore } from "../stores/useReservationStore";
import { useApplyStore } from "../stores/usePlaceStore";

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const { fetchOwnPlacesReservations, fetchAcceptedReservations, pendingReservations, acceptedReservations } = useReservationStore();
    const { fetchPlacesByUser, places } = useApplyStore();

    const tabs = [
        { id: "myPlaces", label: "My Places", icon: MapPin },
        { id: "PlaceReservation", label: "Pending Reservations", icon: CalendarCheck },
        { id: "AcceptedReservations", label: "Accepted", icon: CheckCircle }
    ];
    
    const [activeTab, setActiveTab] = useState('myPlaces');

    useEffect(() => {
        fetchPlacesByUser();
        fetchOwnPlacesReservations();
        fetchAcceptedReservations();
    }, [fetchPlacesByUser, fetchOwnPlacesReservations, fetchAcceptedReservations]);

    const calculateDuration = (start, end) => {
        if (start === undefined || end === undefined || start === null || end === null) return 0;
        
        if (!String(start).includes(':') && !String(end).includes(':')) {
            return Math.max(0, Number(end) - Number(start));
        }

        const [sH, sM = 0] = String(start).split(':').map(Number);
        const [eH, eM = 0] = String(end).split(':').map(Number);
        const startTotalMinutes = sH * 60 + (isNaN(sM) ? 0 : sM);
        const endTotalMinutes = eH * 60 + (isNaN(eM) ? 0 : eM);
        return Math.max(0, (endTotalMinutes - startTotalMinutes) / 60);
    };

    const stats = useMemo(() => {
        const totalBookings = (pendingReservations?.length || 0) + (acceptedReservations?.length || 0);
        const activePlaces = places?.length || 0;
        const totalRevenue = (acceptedReservations || []).reduce((sum, res) => {
            const place = (places || []).find(p => p._id === res.madeOn);
            const price = place ? Number(place.price) : 0;
            const duration = calculateDuration(res.startTime, res.endTime);
            const lineRevenue = (isNaN(price) ? 0 : price) * (isNaN(duration) ? 0 : duration);
            return sum + lineRevenue;
        }, 0);

        return [
            { label: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck, color: "text-primary-600", bg: "bg-primary-50" },
            { label: "Active Places", value: activePlaces.toString(), icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ];
    }, [pendingReservations, acceptedReservations, places]);

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-secondary-900 flex items-center gap-3">
                            <LayoutDashboard className="text-primary-600" />
                            Owner Dashboard
                        </h1>
                        <p className="text-secondary-500 mt-2">Manage your facilities and track your reservations</p>
                    </div>
                    <button className="btn-primary group" onClick={() => navigate('/applyform')}>
                        Add New Facility
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm flex items-center gap-4"
                        >
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-secondary-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 overflow-hidden">
                    <div className="flex border-b border-secondary-100 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
                                    ? "text-primary-600"
                                    : "text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "myPlaces" && <MyPlaces />}
                                {activeTab === "PlaceReservation" && <PlaceReservation />}
                                {activeTab === "AcceptedReservations" && <AcceptedReservations />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard