import { MessageSquare, Zap } from "lucide-react";
import { motion } from "motion/react";

const NoChatSelected = () => {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-12 bg-secondary-50/30">
            <div className="max-w-md text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-500/10 border border-primary-100"
                        >
                            <MessageSquare size={48} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
                        >
                            <Zap size={18} fill="currentColor" />
                        </motion.div>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-display font-black text-secondary-900 mb-4 tracking-tight">
                    Welcome to <span className="text-primary-600">RentArena Chat</span>
                </h2>
                <p className="text-secondary-500 text-lg mb-10 leading-relaxed">
                    Select a conversation from the sidebar to start coordinating your next game, or browse for new facilities to book.
                </p>
            </div>
        </div>
    );
};

export default NoChatSelected;