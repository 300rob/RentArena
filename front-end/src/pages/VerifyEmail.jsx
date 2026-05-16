import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore"
import {Link, useSearchParams, } from 'react-router-dom'
const VerifyEmail = () => {
const {verifyEmail} = useUserStore();
const [searchParams] = useSearchParams();

useEffect(() => {
const token = searchParams.get("token");
 const email = searchParams.get("email");

if(token && email) {
    verifyEmail(token,email)
}
},[])

return (
    <div>
        <h2>Account confirmed!</h2>
        <Link to='/login'>Login here!</Link>
    </div>
)
}

export default VerifyEmail