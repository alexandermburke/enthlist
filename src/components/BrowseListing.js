'use client'
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React from 'react';
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
        price: '',
        image: ''
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

    async function ContactSeller() {
   
    }

    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData)
    const [showModal, setShowModal] = useState(null);
    const [listings, setListings] = useState([]);
    const { currentUser, userDataObj } = useAuth();
    const numberOfListings = listings.length;

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()[doc.id] }));
                console.log("Listings Data:", listingsData); // Check if data is fetched
                setListings(listingsData);
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };
    
        fetchListings();
    }, []);
    
    
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
                        <div className='flex flex-col gap-4'>
                            <div className='grid grid-cols-1 shrink-0 '>
                                {/* Add labels for listing columns */}
                            </div>
                            {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id' && val !== 'image').map((entry, entryIndex) => {
                                return (
                                    <div className='flex items-center gap-5' key={entryIndex}>
                                        <p className='capitalize font-medium w-24 sm:w-32'>{entry}{['company', 'role'].includes(entry) ? '' : ''}</p>
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
                            <button onClick={handleFilter} className='ml-4  duration-200 overflow-hidden  p-0.5 rounded-full relative'>
                                <div className='absolute inset-0 blueBackground ' />
                                <p className='h-full px-3 grid place-items-center relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white'>{'Filter'}</p>
                            </button>
                        </div>
                    </FilterCard>

                    {/* Listings action card */}
                    <ActionCard title={'Listings'}>
                        <div className='flex flex-col gap-4 '>
                            <div className='grid grid-cols-1 shrink-0 '>
                                {/* div for spacing */}
                            </div>
                            {listings.map((listing, index) => {
                                const { applicationMeta } = listing; // Destructure directly from listing
                                return (
                                    <div className='grid grid-cols-1 gap-4' key={index}>
                                        {/* Listing details */}
                                        <Link href={'/browse/listing?id=' + (applicationMeta?.id || listing.id)}>
                                            <div className='rounded-2xl border border-solid border-blue-50 duration-200 hover:bg-blue-50 overflow-hidden blueShadow hover:border-indigo-300 '>
                                                <img
                                                    src={applicationMeta?.image} // Make sure this provides a valid URL
                                                    alt="Image"
                                                    className="action-card-image items-center"
                                               //     style={{
                                               //         maxHeight: '800px',
                                                //        maxWidth: '850px',
                                                //        width: '100%',
                                                //        height: 'auto',
                                                //    }}
                                                />
                                                <div className='flex flex-col gap-0 p-1 m-1'>
                                                    {/* Wrap the truncate divs in a flex container */}
                                                    <p className='truncate'>{applicationMeta?.company && applicationMeta?.model ? `${applicationMeta.year + ' ' + applicationMeta.company} ${applicationMeta.model}` : ''}</p>
                                                    <p className='truncate'>{applicationMeta?.id + ' • ' + applicationMeta?.miles + ' Miles'}</p>
                                                    <div className='text-xl sm:text-2xl blueGradient font-medium'>
                                                        <p className='truncate'>{applicationMeta?.price}</p>
                                                    </div>
                                                </div>
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
