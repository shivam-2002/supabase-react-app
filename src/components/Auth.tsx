import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signUp = async () => {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) alert(error.message)
    }

    const signIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) alert(error.message)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' , justifyContent: 'center', alignItems: 'center' }}>
            <h2>Sign Up / Sign In</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <br />
            <div>
                <button onClick={signUp}>Sign Up</button>
                <button onClick={signIn}>Sign In</button>
            </div>
        </div>
    )
}