'use client'
import Main from '@/components/Main'
import Register from '@/components/Register';
import { useAuth } from '@/context/AuthContext';
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Plans from '@/components/Plans';
import CoolLayout from '@/components/CoolLayout';
import { collection, doc, documentId, getCountFromServer, getDoc, where, query } from 'firebase/firestore';
import { db } from '@/firebase';

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [step, setStep] = useState(0)
    const [authenticating, setAuthenticating] = useState(false)
    // const [usernameList, setUsernameList] = useState([])
    const [userExists, setUserExists] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState(null)

    const { signup, addUsername, currentUser } = useAuth()

    async function isValidUsername(id) {
        if (id.includes(' ')) { return true }
        try {
            const res = await fetch('/api/usernames?username=' + id)
            const { isUnique } = await res.json()
            return isUnique
        } catch (err) {
            console.log('Failed to check username')
            return true
        }
    }

    async function handleSubmit() {
        setUserExists(false)
        setError(false)
        if (!username || !email || isVerifying || authenticating) { return }
        if (username.length < 5 || username.includes(' ')) {
            setError('Username must be more than 5 characters in length and cannot contain any spaces.')
            return
        }
        if ((step == 1 && (!password || password.length < 8))) {
            setError('Password must be more than 8 characters in length')
            return
        }
        if (step === 0) {
            setIsVerifying(true)
            const usernameStatus = await isValidUsername(username)
            if (!usernameStatus) {
                setUserExists(true)
                setError('This username is taken!')
            } else {
                console.log('Unique username provided')
                setUserExists(false)
                setStep(1)
            }
            setIsVerifying(false)
            return
        }
        try {
            setAuthenticating(true)
            const userCredential = await signup(email, password)
            const currentUser = userCredential.user
            const addUsernameStatus = await addUsername(currentUser, username)
            console.log(currentUser)
            setStep(2)
        } catch (err) {
            console.log('Failed to register', err.message)
            setError(err.message)
        } finally {
            setAuthenticating(false)
        }
    }

    function goBack() {
        setStep(0)
    }

    return (
        <CoolLayout>
            <Main>
                <Suspense loading={(
                    <div className='flex items-center justify-center flex-col flex-1'>
                        <i className="fa-solid fa-spinner text-white animate-spin text-4xl sm:text-5xl md:text-6xl"></i>
                    </div>
                )}>
                    {(step < 2 && !currentUser) ? (
                        <Register isVerifying={isVerifying} error={error} submitting={authenticating} userExists={userExists} email={email} password={password} username={username} setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} authenticating={authenticating} handleSubmit={handleSubmit} goBack={goBack} step={step} />
                    ) : (
                        <Plans />
                    )}
                </Suspense>
            </Main>
        </CoolLayout>
    )
}
