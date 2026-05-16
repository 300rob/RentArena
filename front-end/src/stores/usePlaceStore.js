import {create} from "zustand"
import axios from "../lib/axios"
import toast from "react-hot-toast"

export const useApplyStore = create((set,get) => ({
    applies: [],
    loading: false,
    imageUrls: [],
    imageUrl: "",
    places: [],

    uploadImage: async(file) => {
        set({loading:true});
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await axios.post('/apply/uploadImage', formData);
            set({imageUrl: res.data.url, loading: false})
            return [res.data.url]
        } catch (error) {
            console.log(error)
            set({loading: false});
        }
    },

    uploadImages: async(files) => {
        set({loading:true})
        try {
            const formData = new FormData()
            for(const file of files) {
                formData.append('placeImage', file)
            }
            const res = await axios.post(`/apply/uploadsImages`, formData)
            set({imageUrls: res.data.urls, loading: false})
            return res.data.urls;
        } catch (error) {
            console.log(error)
            set({loading: false})
        }
    },

    createApply: async(applyData) => {
        set({loading: true})
        try {
            const urls = get().imageUrls;
            const url = get().imageUrl;
            const res = await axios.post('/apply/apply-for-ownership', {...applyData, placePhoto:urls ,proofOfOwnership: url})
            set((prevState) => ({
                applies: [...prevState.applies, res.data],
                loading: false
            }))
            toast.success("Application submitted successfully!")
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to submit application")
            set({loading: false})
        }
    },

    deleteRequest: async(applyId) => {
        set({loading: true})
        try {
            await axios.delete(`/apply/delete-request/${applyId}`)
            set((state) => ({
                applies: state.applies.filter((apply) => apply._id !== applyId),
                loading: false,
            }))
            toast.success("Request deleted")
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete request")
            set({loading: false})
        }
    },

    deletePlaces: async(placeId) => {
        set({loading: true})
        try {
            await axios.delete(`/places/ownplaces/${placeId}`)
            set((state) => ({
                places: state.places.filter((p) => p._id !== placeId),
                loading: false
            }))
            toast.success("Facility removed")
        } catch (error) {
            console.log(error)
            set({loading: false})
        }
    },

    fetchPendingRequests: async(category) => {
        set({loading:true})
        try {
            const res = await axios.get(`/apply/status/pending/${category}`)
            set({applies: res.data.applies, loading: false})
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch requests")
            set({loading: false})
        }
    },

    fetchApprovedRequest: async(category) => {
        set({loading:true});
        try {
            const res = await axios.get(`/apply/status/approved/${category}`)
            set({applies: res.data.applies, loading: false})
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch approved requests")
            set({loading: false})
        }
    },

    acceptRequest: async(requestId) => {
        set({loading: true})
        try {
            await axios.patch(`/apply/approve/${requestId}`)
            set((state) => ({
                applies: state.applies.filter((apply) => apply._id !== requestId),
                loading: false
            }))
            toast.success("Application approved!")
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to approve application")
            set({loading: false})
        }
    },

    fetchPlacesById: async(applyId) => {
        set({loading: true});
        try {
            const response = await axios.get(`/apply/${applyId}`)
            set({applies: response.data.acceptReq, loading:false})
        } catch (error) {
            set({loading: false})
            toast.error(error.response?.data?.error || "Failed to fetch facility");
        }
    },

    fetchPlacesByUser: async() => {
        set({loading:true});
        try {
            const res = await axios.get(`/places/placesbyusers`)
            set({places: res.data.places, loading:false});
        } catch (error) {
            console.log(error)
            set({loading: false})
        }
    }
}))