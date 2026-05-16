import { useState } from "react"
import {useUserStore} from '../stores/useUserStore' 
import { Mail } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {isLoading, forgotPassword} = useUserStore()

    const handleSubmit = async(e) => {
        e.preventDefault()
        await forgotPassword(email)
        setIsSubmitted(true)
    }

    return (
        <div>
        <h2>
         Forgot Password
        </h2>
        {!isSubmitted ? (<form onSubmit={handleSubmit}><p>Enter your email to reset your password</p>
        <input type="email" placeholder="Email Address" value={email}  onChange={(e)=> {setEmail(e.target.value)}}/>
        <button type="submit">Submit</button>
        </form>
    ) : (<p>You will recieve a password reset link in a moment</p>)}
        </div>
    )
}


export default ForgotPassword