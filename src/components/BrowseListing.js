'use client'
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import ActionCard from './ActionCard';
import LogoFiller from './LogoFiller';
import Modal from './Modal';
import Button from './Button';
import { useRouter } from 'next/navigation';
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });
const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});
export default function BrowseListing() {
    const router = useRouter(); // Initializing useRouter hook
    const [showModal, setShowModal] = useState(false); // Setting initial value of showModal to false
    const { currentUser, loading, userDataObj, setUserDataObj, isPaid } = useAuth();
    let numberOfLetters = Object.keys(userDataObj?.listings || {}).length;

    useEffect(() => {
        if (numberOfLetters >= 3) {
         
            setShowModal(true); // Show the modal if numberOfLetters is greater than or equal to 3
        } else {
            router.push('/browse/error'); // Redirect to '/admin/application' if numberOfLetters is less than 3
        }
    }, [numberOfLetters]); // Run this effect when numberOfLetters changes

    return (
        <>
            <ActionCard
                title={'Listings'}
                actions={
                    numberOfLetters >= 20 ? null : (
                        <div className='flex flex-col gap-2 overflow-x-scroll'>
                            <div className='grid grid-cols-4 shrink-0'>
                                {['VIN', 'company', 'model', 'live', '', '', ''].map((label, labelIndex) => {
                                    return (
                                        <div key={labelIndex} className='p-1 capitalize px-2 text-xs sm:text-sm font-medium'>
                                            <p className='truncate'>{label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <LogoFiller />
                        </div>
                    )
                }
            />
        ]
        </>
    );
}