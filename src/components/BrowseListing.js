'use client';
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React from 'react';
import ActionCard from './ActionCard';
import LogoFiller from './LogoFiller';

export default function BrowseListings() {
    const { currentUser, loading, userDataObj, setUserDataObj, isPaid } = useAuth();
    let numberOfListings = Object.keys(userDataObj?.listings || {}).length;

    return (
        <div className='flex flex-col gap-8 flex-1'>
            <ActionCard
                title={'Listings'}
                actions={
                    numberOfListings >= 20 ? null : (
                        <div className='grid grid-cols-4 gap-4'>
                            {(Object.keys(userDataObj?.listings || {}) || []).map((coverLetterName, coverLetterIndex) => {
                                const coverLetter = userDataObj?.listings?.[coverLetterName] || {};
                                const { applicationMeta, carDescription, application } = coverLetter;
                                return (
                                    <div key={coverLetterIndex} className='rounded-lg border border-solid border-blue-50 duration-200 hover:bg-blue-50 overflow-hidden'>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.id}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.company}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.model}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className={'truncate ' + (application ? 'text-green-400' : 'text-pink-300')}>{application ? 'True' : 'False'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            />
        </div>
    );
}
