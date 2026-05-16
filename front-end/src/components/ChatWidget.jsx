import { useState } from 'react';
import { MessageCircle, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MessageSidebar from './MessageSidebar';
import ChatContainer from './ChatContainer';
import NoChatSelected from './NoChatSeleted';
import { useChatStore } from '../stores/useChatStore';
import { useUserStore } from '../stores/useUserStore';

const ChatWidget = () => {
    const { selectedUser, isChatOpen, setChatOpen } = useChatStore();
    const [isMinimized, setIsMinimized] = useState(false);
    const { user } = useUserStore();

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`pointer-events-auto bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-secondary-100 overflow-hidden mb-4 flex flex-col md:flex-row transition-all duration-500 ease-in-out ${
                            isMinimized ? 'h-16 w-80' : 'w-[95vw] md:w-[850px] h-[70vh] md:h-[600px]'
                        }`}
                    >
                        {isMinimized ? (
                            <div className="flex-1 flex items-center justify-between px-6 bg-primary-600 text-white cursor-pointer" onClick={() => setIsMinimized(false)}>
                                <div className="flex items-center gap-3">
                                    <MessageCircle size={20} />
                                    <span className="font-bold text-sm">Messages</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setChatOpen(false); }}>
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <>

                                <div className={`w-full md:w-80 border-r border-secondary-100 bg-secondary-50 flex flex-col ${selectedUser && 'hidden md:flex'}`}>
                                    <MessageSidebar />
                                </div>


                                <div className={`flex-1 flex flex-col bg-white relative ${!selectedUser && 'hidden md:flex'}`}>
                                    <div className="absolute top-4 right-4 z-20 flex gap-2 pointer-events-auto md:hidden">
                                        <button 
                                            onClick={() => setChatOpen(false)}
                                            className="p-2 bg-secondary-100/50 backdrop-blur-md rounded-full text-secondary-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChatOpen(!isChatOpen)}
                className={`pointer-events-auto w-16 h-16 rounded-[1.5rem] shadow-[0_10px_30px_-5px_rgba(var(--color-primary-600),0.3)] flex items-center justify-center transition-all duration-300 relative group ${
                    isChatOpen ? 'bg-secondary-900 text-white rotate-90' : 'bg-primary-600 text-white'
                }`}
            >
                {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
                
                {!isChatOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
