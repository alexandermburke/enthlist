'use client'
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import ActionCard from './ActionCard';
import FilterCard from './FilterCard';
import LogoFiller from './LogoFiller';
import Modal from './Modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });
const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});

export default function BrowseListings() {

    let defaultApplicationData = {
        company: '',
        model: '',
        year: '',
        status: '', // dropdown between preparation submitted followed up rejected approved
        id: '',
        miles: '',
        exterior: '',
        interior: '',
        seats: '',
        transmission: '',
        price: ''
    }
    const placeHolders = {
        company: 'BMW', model: 'M3', year: '2018', status: 'clean', miles: '10,000', exterior: 'alpine white', interior: 'black', seats: 'competition', transmission: 'DCT', price: '$50,000'
    }

    function sortDetails(arr) {
        const order = ['company', 'price', 'model', 'exterior', 'year', 'interior', 'miles', 'seats', 'status', 'transmission']
        return [...arr].sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b)
        })
    }

    async function handleFilter() {
   
    }


    const [includeListing, setIncludeListing] = useState(true)
    const [showStatuses, setShowStatuses] = useState(false)
    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData)
    const [showModal, setShowModal] = useState(null);
    const router = useRouter();

    const { currentUser, userDataObj } = useAuth();
    const numberOfListings = Object.keys(userDataObj?.listings || {}).length;

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {/* Add modal content here */}
                </Modal>
            )}

            <div className='flex flex-col gap-4 flex-1'>
                <div className='flex gap-4'>
                    
                    <FilterCard title={'Filters'}>
                    <div className='flex flex-col gap-3 overflow-x-scroll'>
                            <div className='grid grid-cols-1 shrink-0'>
                                {/* Add labels for listing columns */}
                            </div>
                         {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id').map((entry, entryIndex) => {
                            return (
                                
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className=' capitalize font-medium w-24 sm:w-32'>{entry}{['company', 'role'].includes(entry) ? '' : ''}</p>
                                    {entry === '' ? (
                                      <div className='flex flex-col gap-1 w-full relative'>
                                      </div>
                                        
                                    ) : (
                                        <input
                                            className='bg-transparent capitalize w-full outline-none border-none'
                                            placeholder={placeHolders[entry]}
                                            value={applicationMeta[entry]}
                                            onChange={(e) => updateUserData(entry, e.target.value)} />
                                    )}
                                    
                                </div>
                            )
                        })}
                    <button onClick={handleFilter} className='flex items-center justify-center gap-4 border border-solid border-blue-100  px-4 py-2 rounded-full text-xs sm:text-sm text-indigo-400 duration-200 hover:opacity-50'>
                    <p className=''>{'Filter'}</p>
                    </button>
                                  
                    </div>
                    
                    </FilterCard>

                    {/* Listings action card */}
                    <ActionCard title={'Listings'}>
                        
                        <div className='flex flex-col gap-4 overflow-x-scroll'>
                            <div className='grid grid-cols-4 shrink-0'>
                                {/* Add labels for listing columns */}
                            </div>
                            {(Object.keys(userDataObj?.listings || {}) || []).map((ListingName, ListingIndex) => {
                                const Listing = userDataObj?.listings?.[ListingName] || {}
                                const { applicationMeta, carDescription, application } = Listing
                                return (
                                    <div className='grid grid-cols-4 gap-4 ' key={ListingIndex}>
                                    
                                        {/* Listing details */}
                                        <Link href={'/browse?id=' + (applicationMeta?.id || ListingName)} className='rounded-lg border border-solid border-blue-50 duration-200 hover:bg-blue-50 overflow-hidden'>
                                            <div className='p-2'>
                                                <p className='truncate'>{applicationMeta?.id}</p>
                                            </div>
                                            <div className='p-2'>
                                                <p className='truncate'>{applicationMeta?.company}</p>
                                            </div>
                                            <div className='p-2'>
                                                <p className='truncate'>{applicationMeta?.model}</p>
                                            </div>
                                       
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </ActionCard>
                </div>
            </div>
            <LogoFiller />
        </>
    );
}
