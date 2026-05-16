import { useEffect, useState } from "react";
import { useReservationStore } from "../stores/useReservationStore"
import { useParams } from "react-router-dom";
import { Calendar, Clock, AlertCircle, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Reservation = () => {
    const hours = Array.from({length: 15}, (_,i) => 8 + i)
    const { applyId } = useParams();
    const { createReservation, fetchReservationById, loading, reservations, resetReservations } = useReservationStore();

    const [addNewReservation, setAddNewReservation] = useState({
        date: "",
        endTime: "",
        startTime: "",
    })
    const { date, endTime, startTime } = addNewReservation;

    useEffect(() => {
        if(date && applyId) fetchReservationById(applyId, date);
        return () => { resetReservations([]); };
    }, [date, applyId, fetchReservationById])

    const isOccupied = (hour) => {
        if (!reservations || reservations.length === 0) return false;
        return Object.entries(reservations).some(([key, reservation]) => hour >= reservation.startTime && hour < reservation.endTime);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await createReservation(addNewReservation, applyId)
            setAddNewReservation({
                date: "",
                endTime: "",
                startTime: "",
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700 flex items-center gap-2">
                    <Calendar size={16} className="text-primary-500" />
                    Select Date
                </label>
                <input
                    type="date"
                    className="input-field"
                    value={date}
                    onChange={(e) => setAddNewReservation({ ...addNewReservation, date: e.target.value })}
                />
            </div>

            <AnimatePresence>
                {date && (
                    <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit} 
                        className="space-y-6 pt-4 border-t border-secondary-100"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Start Time</label>
                                <select
                                    className="input-field bg-white"
                                    value={startTime}
                                    onChange={(e) => setAddNewReservation({ ...addNewReservation, startTime: Number(e.target.value) })}
                                >
                                    <option value="">Start</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour} disabled={isOccupied(hour)}>
                                            {hour}:00
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider">End Time</label>
                                <select
                                    className="input-field bg-white"
                                    value={endTime}
                                    onChange={(e) => setAddNewReservation({ ...addNewReservation, endTime: Number(e.target.value) })}
                                >
                                    <option value="">End</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour} disabled={hour <= startTime || isOccupied(hour)}>
                                            {hour}:00
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        {reservations.length > 0 && (
                            <div className="bg-secondary-50 p-4 rounded-2xl border border-secondary-100">
                                <h4 className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock size={12} />
                                    Occupied Slots
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(reservations).map((reservation, index) => (
                                        <span key={index} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100">
                                            {reservation.startTime}:00 - {reservation.endTime}:00
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!date || !startTime || !endTime || loading}
                            className="btn-primary w-full py-4 rounded-2xl text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <>
                                    Confirm Reservation
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                </>
                            )}
                        </button>
                        
                        <p className="text-center text-[11px] text-secondary-400 font-medium">
                            By clicking confirm, you agree to our terms and conditions.
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
            
            {!date && (
                <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                    <Info className="text-primary-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-primary-700 leading-relaxed font-medium">
                        Select a date to check availability and book your session.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Reservation