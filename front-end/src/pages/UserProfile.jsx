import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore"
import { Camera, Mail, User, Loader2 } from "lucide-react";
import { useParams } from 'react-router-dom'
import { motion } from "motion/react";

const UserProfile = () => {
    const { user, isUpdatingProfile, updateProfile, fetchUser } = useUserStore();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchUser(id)
        }
    }, [id, fetchUser])

    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        }
    }

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary-50 py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary-100"
                >

                    <div className="p-8 border-b border-secondary-50 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl border-4 border-secondary-100 overflow-hidden shadow-inner bg-secondary-50">
                                <img
                                    src={selectedImg || user.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label
                                htmlFor="avatar"
                                className="absolute -bottom-3 -right-3 bg-primary-600 p-2.5 rounded-xl text-white cursor-pointer shadow-lg hover:bg-primary-700 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                            >
                                {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                                <input
                                    type="file"
                                    id="avatar"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">{user.name}</h1>
                            <p className="text-secondary-500 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4 text-primary-500" />
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-secondary-400 uppercase tracking-widest">Account Details</h3>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl border border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <User className="w-4 h-4 text-primary-500" />
                                    </div>
                                    <span className="text-sm font-semibold text-secondary-600">Full Name</span>
                                </div>
                                <span className="font-bold text-secondary-900">{user.name}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl border border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-secondary-500 font-bold">
                                        ID
                                    </div>
                                    <span className="text-sm font-semibold text-secondary-600">Role</span>
                                </div>
                                <span className="font-bold text-secondary-900 capitalize">{user.role || 'Member'}</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-secondary-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-secondary-500">
                                Member since <span className="font-bold text-secondary-900">{user.verifiedAt ? user.verifiedAt.slice(0, 10) : '2024'}</span>
                            </p>
                            <p className="text-xs text-secondary-400 uppercase tracking-widest font-bold">
                                RentArena Official Platform
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UserProfile