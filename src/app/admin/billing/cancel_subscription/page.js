'use client'
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function CancelPage() {
    const [helped, setHelped] = useState(null)
    const router = useRouter()
    const { currentUser, userDataObj, setUserDataObj } = useAuth()

    async function handlePlanCancellation() {
        if (!helped || !userDataObj?.billing?.stripeCustomerId || !userDataObj?.billing?.plan === 'Pro' || !userDataObj?.billing?.status) { return }
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: userDataObj?.billing?.stripeCustomerId,
                    userId: currentUser.uid,
                    stripeCustomerId: userDataObj?.billing?.stripeCustomerId
                })
            }
            const response = await fetch('/api/checkout', options)
            if (response.ok) {
                const userRef = doc(db, 'users', currentUser.uid)
                const res = await setDoc(userRef, { billing: { plan: 'Free', status: false } }, { merge: true })
                let firebaseData = { ...userDataObj, billing: { plan: 'Free', status: false } }
                setUserDataObj(firebaseData)
                localStorage.setItem('hyr', JSON.stringify({ ...firebaseData }))
                router.push('/admin/account')
            }
        } catch (err) {
            console.log('Failed to cancel plan', err.message)
        }
    }

    return (
        <div className='flex flex-1 items-center justify-center flex-col gap-8 pb-20 bg-white rounded-xl'>
            <p className='text-center  text-xl sm:text-2xl md:text-3xl text-blue-400'>More jobs for us then aye 😜 </p>
            <p>Did we help you on your job search?</p>
            <div className='grid grid-cols-2 gap-4'>
                <button onClick={() => { setHelped('no') }}>
                    <p>No {helped === 'no' ? ' 🥲' : ' '}</p>
                </button>
                <button onClick={() => { setHelped('yes') }}>
                    <p>Yes {helped === 'yes' ? ' 🔥' : ' '}</p>
                </button>
            </div>
            <div className='flex items-center gap-4'>
                <Link href={'/admin'} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-blue-100 bg-white p-4 rounded-full text-blue-400 duration-200 hover:opacity-50 '}>
                    <p className=''>Back to home</p>
                    <i className="fa-solid fa-home"></i>
                </Link>
                <button onClick={handlePlanCancellation} className={'duration-200 ' + (helped ? ' opacity-100' : ' opacity-30 cursor-not-allowed')}>
                    <p>Confirm cancellation</p>
                </button>
            </div>
        </div >
    )
}
