import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import auth from '../firebase/auth'
import { getUserByEmail } from '../service/UserService'
import TextField from './components/TextField'
import TreeLogo from './components/TreeLogo'

const ResetPassword = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")

    const handleResetPassword = async () => {
        if (!email?.length) {
            return;
        } 
        const user = await getUserByEmail(email);
        if (!user || !user.exists()) {
            alert("Could not find a user with the given email address.")
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Please check your email for a password reset link. It might appear in junk/spam folder")
                router.push("/auth")
            })
    }

  return (
    <div className='antialiased text-stone-200 min-h-screen text-center pt-10 text-xl' id='firebaseui-auth-container' >
            <Link href='/' passHref>
                <div>
                    <TreeLogo height={140} width={375} />
                </div>
            </Link>
            <TextField
                onChange={setEmail}
                value={email}
                width={150}
                placeholder="Email address"
                type="email"
            />
            <button className='bg-lime-700 text-zinc-100 px-4 py-2 w-48
                                rounded text-center translate-x-6 hover:bg-lime-400 hover:text-green'
                onClick={handleResetPassword}
            >
                Reset password
            </button>
        </div>
  )
}

export default ResetPassword