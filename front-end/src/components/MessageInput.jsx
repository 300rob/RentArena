import { useState, useRef } from "react";
import { useChatStore } from "../stores/useChatStore";
import { Send, Image, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="relative">
            {imagePreview && (
                <div className="absolute bottom-full left-0 mb-4 p-2 bg-white rounded-2xl shadow-xl border border-secondary-100 animate-fade-in">
                    <div className="relative group">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-xl border border-secondary-100"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-secondary-100/50 rounded-2xl px-4 py-1.5 border border-transparent focus-within:bg-white focus-within:border-primary-500/30 focus-within:shadow-md transition-all">
                    <button
                        type="button"
                        className="text-secondary-400 hover:text-primary-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>

                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-secondary-400"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                </div>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />

                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${text.trim() || imagePreview
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-95"
                            : "bg-secondary-100 text-secondary-400 cursor-not-allowed"
                        }`}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;