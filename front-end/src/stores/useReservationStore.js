import {create} from 'zustand'
import toast from "react-hot-toast"
import axios from '../lib/axios'

export const useReservationStore = create((set,get) => ({
    reservations: [],
    pendingReservations: [],
    acceptedReservations: [],
    loading: false,

    resetReservations: () => set({ reservations: [], pendingReservations: [], acceptedReservations: [] }),

    createReservation: async(reservationData, applyId) => {
        set({loading: true});
        try {
            const res = await axios.post(`/reservation/create/${applyId}`, reservationData)
            set({reservations: res.data.createReservation, loading: false})
            toast.success("Reservation request sent!");
        } catch (error) {
            console.log(error)
            toast.error("Failed to create reservation");
            set({loading: false});
        }
    },

    fetchReservationById: async(applyId, date) => {
        set({loading:true});
        try {
            const res = await axios.get(`/reservation/${applyId}?date=${date}`);
            set({ reservations: res.data.getReservation, loading: false });
        } catch (error) {
            console.log(error)
            set({loading: false});
        }
    },

    fetchOwnPlacesReservations: async() => {
        set({loading: true});
        try {
            const res = await axios.get('/reservation/getOwnPlaces')
            set({
                pendingReservations: res.data.PlaceOwnByUserReservation,
                reservations: res.data.PlaceOwnByUserReservation,
                loading: false
            })
        } catch (error) {
            console.log(error)
            set({loading: false});
        }
    },

    fetchAcceptedReservations: async() => {
        set({loading: true});
        try {
            const res = await axios.get('/reservation/acceptedReservation')
            set({
                acceptedReservations: res.data.PlaceOwnByUserReservation,
                loading: false
            })
        } catch (error) {
            console.log(error)
            set({loading: false});
        }
    },

    acceptReservation: async(reservationId) => {
        set({loading:true})
        try {
            await axios.patch(`/reservation/accept/${reservationId}`)
            const accepted = get().pendingReservations.find(r => r._id === reservationId);
            
            set((state) => ({
                pendingReservations: state.pendingReservations.filter((r) => r._id !== reservationId),
                reservations: state.reservations.filter((r) => r._id !== reservationId),
                acceptedReservations: accepted ? [...state.acceptedReservations, { ...accepted, status: 'approved' }] : state.acceptedReservations,
                loading: false
            }))
            toast.success("Reservation accepted!");
        } catch (error) {
            console.log(error)
            set({loading: false});
            toast.error("Failed to accept reservation");
        }
    },

    deleteReservation: async(reservationId) => {
        set({loading: true});
        try {
            await axios.delete(`/reservation/delete/${reservationId}`);
            set((state) => ({
                pendingReservations: state.pendingReservations.filter((r) => r._id !== reservationId),
                acceptedReservations: state.acceptedReservations.filter((r) => r._id !== reservationId),
                reservations: state.reservations.filter((r) => r._id !== reservationId),
                loading: false
            }))
            toast.success("Reservation removed");
        } catch (error) {
            console.log(error);
            set({loading: false});
            toast.error("Failed to delete reservation");
        }
    }
})) 
