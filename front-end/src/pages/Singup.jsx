import { useState } from "react"
import { Loader, User, Mail, Lock, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { signupSchema } from "../lib/validation"
import toast from "react-hot-toast"

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const { signup, loading } = useUserStore()

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        try {
            await signup(formData)
            navigate('/user/check-email')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-[90vh] flex items-center justify-center bg-secondary-50 px-4 py-12'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-xl shadow-primary-900/5 p-8 border border-secondary-100'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl font-display font-bold text-secondary-900 mb-2'>Create Account</h1>
                    <p className='text-secondary-500'>Join RentArena and start booking facilities</p>
                </div>
                
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-semibold text-secondary-700 mb-2'>Full Name</label>
                        <div className='relative'>
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-secondary-400'}`} size={18} />
                            <input 
                                id='name' 
                                type="text" 
                                value={formData.name}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder='Enter you name'
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className='block text-sm font-semibold text-secondary-700 mb-2'>Email Address</label>
                        <div className='relative'>
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-secondary-400'}`} size={18} />
                            <input 
                                id='email' 
                                type="email" 
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.email ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder='Enter your email'
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className='block text-sm font-semibold text-secondary-700 mb-2'>Password</label>
                        <div className='relative'>
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-400' : 'text-secondary-400'}`} size={18} />
                            <input 
                                id='password' 
                                type="password" 
                                value={formData.password}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.password ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder='Enter your password'
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className='btn-primary w-full py-3 mt-4'
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className='animate-spin' />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className='mt-8 pt-8 border-t border-secondary-100 text-center'>
                    <p className='text-secondary-600'>
                        Already have an account?{" "} 
                        <Link to='/login' className='text-primary-600 font-bold hover:text-primary-700 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
