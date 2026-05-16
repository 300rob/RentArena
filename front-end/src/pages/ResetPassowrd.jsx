import { useState } from "react"
import { useUserStore} from '../stores/useUserStore'
import { useNavigate, useParams,useSearchParams } from "react-router-dom"
import toast from 'react-hot-toast'
const ResetPassword = () => { 
    const [password, setPassword] = useState("")
    const {resetPassword, isLoading} = useUserStore()
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
        await resetPassword(password,token,email)
        toast.success("Password resest successfully, redirecting to the login page...");
        setTimeout(() => {
            navigate("/login");
        },2000)
  
        } catch (error) {
            toast.error('Error !!')
        }
    }


    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit" disabled={isLoading}>{isLoading ? "Resetting..." : "Set New Password"}</button>
            </form>
        </div>
    )
}


export default ResetPassword