import {create} from "zustand"
import toast from "react-hot-toast"
import axios from "../lib/axios"
import {io} from 'socket.io-client'

export const useUserStore = create((set,get) => ({
    user: null,
    loading: false,
    isOwner: false,
    checkingAuth: true,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        set({checkingAuth: true, loading: true});
        try {
            const res = await axios.get("/user/showMe"); 
            get().connectSocket()
            set({user: res.data.user, checkingAuth: false, loading: false});
        } catch (error) {
            set({checkingAuth: false, loading: false, user: null})
        }
    },

    signup: async ({name, email, password}) => {
        set({loading: true});
        try {
            const res = await axios.post("/auth/register", {name, email, password});
            set({user: res.data, loading: false})
            get().connectSocket()
        } catch (error) {
            set({loading: false});
            toast.error(error?.response?.data?.message || error.message || "An error occurred")          
        }
    },

    login: async ({email, password}) => {
        set({loading: true})
        try {
            await axios.post("/auth/login", {email, password});
            await useUserStore.getState().checkAuth();
            set({loading: false})
            get().connectSocket()
        } catch (error) {
            set({loading: false});
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
        }
    },

    logout: async () => {
        try {
            await axios.delete('/auth/logout') 
            set({user: null}); 
            get().disconnectSocket()
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
        }
    },

    verifyEmail: async (token, email) => {
        set({loading: true})
        try {
            await axios.post('/auth/verify-email', {verificationToken: token, email});
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
        }
        set({loading: false})
    },

    forgotPassword: async(email) => {
        set({loading: true})
        try {
            await axios.post('/auth/forgot-password', {email})
            set({loading: false})
        } catch (error) {
            set({loading: false})
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
        }
    },

    resetPassword: async(password, token, email) => {
        set({loading: true})
        try {
            await axios.post(`/auth/reset-password`, {password, token, email})
            set({loading: true})
        } catch (error) {
            set({loading: false})
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
        }
    },

    fetchUser: async(id) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axios.get(`/user/profile/${id}`)
            set({user: res.data.user, isUpdatingProfile: false});
        } catch (error) {
            set({isUpdatingProfile: false})
            console.log(error)
        }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axios.put('/user/update-profile', data)
            set({user: res.data, isUpdatingProfile: false});
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred")
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: async() => {
        const {user} = get()
        if(!user || get().socket?.connected) return;
        const socket = io('http://localhost:5000', {
            query: {
                userId: user.userId,
            }
        })
        socket.connect()
        set({socket: socket})
        socket.on("getOnlineUsers", (usersIds) => {
            set({onlineUsers: usersIds})
        })
    },

    disconnectSocket: async() => {
        if(get().socket?.connected) get().socket.disconnect();
    },

    fetchUserData: async(id) => {
        set({loading: true})
        try {
            const res = await axios.get(`/user/${id}`)
            set({user: res.data, loading: false})
        } catch (error) {
            set({loading: false})
            console.log(error)
        }
    }
}))