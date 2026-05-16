import {X} from 'lucide-react'

const Modal = ({open, onClose, children}) => {
return (
<div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-colors 
    ${open ? "visible bg-black/30" : "invisible"}`}>
        <div onClick={e => e.stopPropagation()} className={`bg-white border-2 border-black rounded-lg shadow-lg p-8 transition-all max-w-md ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
            <button onClick={onClose} className="absolute top-4 right-4">
                <X className="text-gray-600 hover:text-black transition" size={24} />
            </button>
            {children}
        </div>
</div>
);
}
export default Modal