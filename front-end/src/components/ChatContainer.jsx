import { useChatStore } from '../stores/useChatStore'
import { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import { useUserStore } from '../stores/useUserStore'
import { formatMessageTime } from '../lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
    const { user } = useUserStore()
    const messageEndRef = useRef(null)

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
        subscribeToMessages()
        return () => unsubscribeFromMessages()
    }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if (!user) return null;

    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col">
            <ChatHeader />
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p className="text-secondary-400 text-sm font-medium">Fetching conversation...</p>
            </div>
        </div>
    );

    const currentUserId = user._id || user.userId;

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <ChatHeader />
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary-50/30 no-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((message, idx) => {
                        const isSentByMe = message.senderId === currentUserId;
                        const showAvatar = idx === 0 || messages[idx-1].senderId !== message.senderId;

                        return (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex items-end gap-3 ${isSentByMe ? 'flex-row-reverse' : 'flex-row'}`}
                                ref={messageEndRef}
                            >
                                <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mb-1 ${!showAvatar && 'opacity-0'}`}>
                                    <img 
                                        src={isSentByMe 
                                            ? user.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name
                                            : selectedUser.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedUser.name
                                        } 
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className={`max-w-[75%] flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                                        isSentByMe 
                                        ? 'bg-primary-600 text-white rounded-br-none' 
                                        : 'bg-white text-secondary-900 rounded-bl-none border border-secondary-100'
                                    }`}>
                                        {message.image && (
                                            <img 
                                                src={message.image}
                                                alt='Attachment'
                                                className='rounded-xl mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity'
                                            />
                                        )}
                                        {message.text && <p className="leading-relaxed">{message.text}</p>}
                                    </div>
                                    <span className="text-[10px] font-bold text-secondary-400 mt-1.5 uppercase tracking-tighter">
                                        {formatMessageTime(message.createdAt)}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-white border-t border-secondary-100">
                <MessageInput />
            </div>
        </div>
    )
}

export default ChatContainer