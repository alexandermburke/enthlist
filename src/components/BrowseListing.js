'use client';
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React from 'react';
import ActionCard from './ActionCard';
import LogoFiller from './LogoFiller';

export default function BrowseListing() {
    const { currentUser, loading, userDataObj, setUserDataObj, isPaid } = useAuth();
    let numberOfLetters = Object.keys(userDataObj?.listings || {}).length;

    return (
        <div className='flex flex-col gap-8 flex-1'>
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
        </div>
    );
}
