'use client'
import Link from 'next/link'
import React from 'react'
import ActionCard from './ActionCard'
import { useAuth } from '@/context/AuthContext'
import LogoFiller from './LogoFiller'

export default function Account() {

    const { currentUser, userDataObj, isPaid } = useAuth()

    const vals = {
        'email': currentUser.email,
        'username': currentUser.displayName,
        'listings': Object.keys(userDataObj?.coverLetters || {}).length,
        'link': 'www.enthusiastlist.app/' + currentUser.displayName,
    }

    const billingObj = {
        'current_plan': userDataObj?.billing?.plan || 'Free',
        'status': userDataObj?.billing?.status ? 'Active' : 'Inactive',
        'actions': (
            <Link href={isPaid ? '/admin/billing/cancel_subscription' : '/admin/billing'} className='duration-200 hover:opacity-60'><p>{isPaid ? 'Cancel plan' : 'Upgrade account'} &rarr;</p></Link>
        )
    }

    return (
        <>
            <div className='flex flex-col gap-8 flex-1'>
                <div className='flex items-center justify-between gap-4'>
                    <Link href={'/admin'} className='flex items-center mr-auto justify-center gap-4 bg-white  px-4 py-2 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                        <p className=''>&larr; Back</p>
                    </Link>
                </div>
                <ActionCard title={'Account Details'} >

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
                        {Object.keys(vals).map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className=' capitalize font-medium w-24 sm:w-32 capitalize'>{entry.replaceAll('_', ' ')}</p>
                                    <p>{vals[entry]}</p>

                                </div>
                            )
                        })}
                    </div>
                </ActionCard>
                <ActionCard title={'Billing & Plan'} >
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
                        {Object.keys(billingObj).map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className=' capitalize font-medium w-24 sm:w-32 capitalize'>{entry.replaceAll('_', ' ')}</p>
                                    {entry === 'actions' ? (
                                        billingObj[entry]
                                    ) : (
                                        <p>{billingObj[entry]}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </ActionCard>
            </div>
            <LogoFiller />
        </>

    )
}
