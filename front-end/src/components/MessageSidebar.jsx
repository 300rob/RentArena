import { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";
import { Search, Users } from "lucide-react";
import { motion } from "motion/react";

const MessageSidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useUserStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isUsersLoading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <LoadingSpinner />
            <p className="text-secondary-400 text-sm animate-pulse">Loading contacts...</p>
        </div>
    );

    return (
        <aside className="h-full flex flex-col bg-secondary-50/50">
            <div className="p-6 border-b border-secondary-100 bg-white/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-secondary-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-600" />
                        Messages
                    </h2>
                    <span className="bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                        {onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} Online
                    </span>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input 
                        type="text" 
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-secondary-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-secondary-400 text-sm italic">No contacts found</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all group relative ${
                                selectedUser?._id === user._id 
                                ? "bg-white shadow-md border border-secondary-100" 
                                : "hover:bg-white/60"
                            }`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors ${
                                    selectedUser?._id === user._id ? 'border-primary-500' : 'border-transparent'
                                }`}>
                                    <img 
                                        src={user.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {onlineUsers.includes(user._id) && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 text-left min-w-0">
                                <h4 className={`font-bold truncate transition-colors ${
                                    selectedUser?._id === user._id ? "text-primary-700" : "text-secondary-900"
                                }`}>
                                    {user.name}
                                </h4>
                                <div className="flex items-center gap-1">
                                    <p className={`text-xs truncate ${
                                        onlineUsers.includes(user._id) ? "text-emerald-600 font-medium" : "text-secondary-400"
                                    }`}>
                                        {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
                                    </p>
                                </div>
                            </div>

                            {selectedUser?._id === user._id && (
                                <motion.div 
                                    layoutId="activeUser"
                                    className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
                                />
                            )}
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
};

export default MessageSidebar;