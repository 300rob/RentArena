import {create} from 'zustand'
import toast from 'react-hot-toast'
import axios from '../lib/axios'
import { useUserStore } from './useUserStore';

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isChatOpen: false,

    setChatOpen: (isOpen) => set({isChatOpen: isOpen}),

    getUsers: async() => {
        set({isUsersLoading: true});
        try {
        const res = await axios.get('/messages/users');
        set({users: res.data})
      } catch (error) {
        console.log(error)
      }
    set({isUsersLoading: false})
    },
    getMessages: async(userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axios.get(`/messages/${userId}`)
            set({messages: res.data})
            console.log('get messages' ,res.data)
        } catch (error) {
           console.log(error) 
        }
        set({isMessagesLoading: false})
    },
    sendMessage: async(messageData) => {
         const {selectedUser, messages} = get()
try {
    const res = await axios.post(`messages/send/${selectedUser._id}`, messageData)
    set({messages:[...messages, res.data]})
    console.log('Send Messages', res)
} catch (error) {
    console.log(error)
    toast.error(error.response.data)
}
    },
    subscribeToMessages: () => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        const socket = useUserStore.getState().socket;
        socket.on('newMessage' , (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId !== selectedUser._id
            if(!isMessageSentFromSelectedUser) return;
            set({messages:[...get().messages, newMessage]
            });
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useUserStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: async(selectedUser) => {
        set({selectedUser})
    },
}))