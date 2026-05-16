import { useChatStore } from "../stores/useChatStore";
import { useUserStore } from "../stores/useUserStore";
import { X, } from "lucide-react";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useUserStore();

    if (!selectedUser) return null;

    return (
        <div className="p-4 bg-white/80 backdrop-blur-lg border-b border-secondary-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-secondary-200">
                        <img
                            src={selectedUser.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedUser.name}
                            alt={selectedUser.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {onlineUsers.includes(selectedUser._id) && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                </div>

                <div>
                    <h3 className="font-bold text-secondary-900 leading-none">{selectedUser.name}</h3>
                    <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest mt-1">
                        {onlineUsers.includes(selectedUser._id) ? (
                            <span className="text-emerald-600">Active Now</span>
                        ) : (
                            <span>Offline</span>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-px h-6 bg-secondary-100 mx-1"></div>
                <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-secondary-50 text-secondary-400 hover:text-red-500 rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;