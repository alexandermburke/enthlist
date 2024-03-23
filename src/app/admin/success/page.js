'use client'
import Button from '@/components/Button'
import CoolLayout from '@/components/CoolLayout'
import Main from '@/components/Main'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Poppins } from 'next/font/google'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function SuccessfulCheckoutPage() {
    //reload all data in here in here
    const { setUserDataObj, currentUser, userDataObj } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!currentUser.uid) { return }
        fetchUserData()
        async function fetchUserData() {

            try {
                const docRef = doc(db, "users", currentUser.uid)
                const docSnap = await getDoc(docRef)
                console.log('Fetching user data')
                let firebaseData = {}
                if (docSnap.exists()) {
                    console.log('Found user data')
                    firebaseData = docSnap.data()
                    setUserDataObj(firebaseData)
                    // set fetched data to local storage to cache it
                    localStorage.setItem('hyr', JSON.stringify({ ...firebaseData }))
                }
            } catch (err) {
                console.log('Failed to fetch data', err.message)
            }
        }
    }, [currentUser.uid, setUserDataObj])

    return (
        <div className='flex flex-1 items-center justify-center flex-col gap-8 pb-20'>
            <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}> <span className='blueGradient'>Congratulations 🎉</span></h2>
            <p className='text-center text-slate-600'>Your account was successfully upgraded to <b>Pro</b>!</p>
            <div className='flex flex-col items-center justify-center'>
                <Button text="Back to dashboard" clickHandler={() => { router.push('/admin') }} />
            </div>
        </div>
    )
}
