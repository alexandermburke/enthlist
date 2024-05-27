'use client'
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
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
        status: '',
        id: '',
        miles: '',
        exterior: '',
        interior: '',
        seats: '',
        transmission: '',
        price: '',
        images: [] // Change to an array to store multiple image URLs
    };

    const placeHolders = {
        company: 'BMW', model: 'M3', year: '2018', status: 'clean', miles: '10,000', exterior: 'alpine white', interior: 'black', seats: 'competition', transmission: 'DCT', price: '$50,000'
    };

    function sortDetails(arr) {
        const order = ['company', 'price', 'model', 'exterior', 'year', 'interior', 'miles', 'seats', 'status', 'transmission'];
        return [...arr].sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b);
        });
    }

    async function handleFilter() {
        // Implement filtering logic
    }

    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData);
    const [showModal, setShowModal] = useState(null);
    const [listings, setListings] = useState([]);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [transitions, setTransitions] = useState({});
    const { currentUser, userDataObj } = useAuth();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()[doc.id] }));
                console.log("Listings Data:", listingsData);
                setListings(listingsData);
                const initialIndexes = listingsData.reduce((acc, _, index) => {
                    acc[index] = 0;
                    return acc;
                }, {});
                setCurrentImageIndexes(initialIndexes);
                setTransitions(listingsData.reduce((acc, _, index) => {
                    acc[index] = false;
                    return acc;
                }, {}));
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };
        fetchListings();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTransitions(prevTransitions => {
                const newTransitions = { ...prevTransitions };
                Object.keys(newTransitions).forEach(key => {
                    newTransitions[key] = true;
                });
                return newTransitions;
            });

            setCurrentImageIndexes(prevIndexes => {
                const newIndexes = { ...prevIndexes };
                Object.keys(newIndexes).forEach(key => {
                    newIndexes[key] = (newIndexes[key] + 1) % (listings[key]?.applicationMeta?.images?.length || 1);
                });
                return newIndexes;
            });
        }, 6000); // Change image timer

        return () => clearInterval(intervalId);
    }, [listings]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTransitions(prevTransitions => {
                const newTransitions = { ...prevTransitions };
                Object.keys(newTransitions).forEach(key => {
                    newTransitions[key] = false;
                });
                return newTransitions;
            });
        }, 500); // Duration of CSS transition

        return () => clearTimeout(timeoutId);
    }, [currentImageIndexes]);

    const handlePrevClick = (index) => {
        setTransitions(prevTransitions => ({ ...prevTransitions, [index]: true }));
        setCurrentImageIndexes(prevIndexes => {
            const newIndexes = { ...prevIndexes };
            newIndexes[index] = (newIndexes[index] - 1 + (listings[index]?.applicationMeta?.images?.length || 1)) % (listings[index]?.applicationMeta?.images?.length || 1);
            return newIndexes;
        });
    };

    const handleNextClick = (index) => {
        setTransitions(prevTransitions => ({ ...prevTransitions, [index]: true }));
        setCurrentImageIndexes(prevIndexes => {
            const newIndexes = { ...prevIndexes };
            newIndexes[index] = (newIndexes[index] + 1) % (listings[index]?.applicationMeta?.images?.length || 1);
            return newIndexes;
        });
    };

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
                        <div className='flex flex-col gap-4 '>
                            <div className='grid grid-cols-1 shrink-0 '>
                                {/* Add labels for listing columns */}
                            </div>
                            {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id' && val !== 'images').map((entry, entryIndex) => {
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
                                                onChange={(e) => setApplicationMeta({ ...applicationMeta, [entry]: e.target.value })} />
                                        )}
                                    </div>
                                )
                            })}
                              <button onClick={handleFilter} className='ml-4  duration-200 overflow-hidden  p-0.5 rounded-full relative blueShadow'>
                                <div className='absolute inset-0 blueBackground ' />
                                <p className='h-full px-3 grid place-items-center relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white '>{'Filter'}</p>
                            </button>
                        </div>
                    </FilterCard>

                    <ActionCard title={'Listings'}>
                        <div className='flex flex-col gap-4 '>
                            <div className='grid grid-cols-1 shrink-0 '>
                                {/* div for spacing */}
                            </div>
                            {listings.map((listing, index) => {
                                const { applicationMeta } = listing;
                                const currentImageIndex = currentImageIndexes[index] || 0;
                                const images = applicationMeta?.images || [];
                                return (
                                    <div className='grid grid-cols-1 gap-4' key={index}>
                                        <Link href={'/browse/listing?id=' + (applicationMeta?.id || listing.id)}>
                                            <div className='relative rounded-2xl border border-solid border-blue-50 duration-200 hover:bg-blue-50 overflow-hidden blueShadow hover:border-indigo-300 '>
                                                <div className="slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: transitions[index] ? 'transform 0.5s ease-in-out' : 'none', display: 'flex' }}>
                                                    {images.map((image, imgIndex) => (
                                                        <img key={imgIndex} src={image} alt={`slide-${imgIndex}`} className="image max-h-128 max-w-128" style={{ width: '100%', flex: 'none' }} />
                                                    ))}
                                                </div>
                                             {/*   <button onClick={(e) => { e.preventDefault(); handlePrevClick(index); }} className='absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full opacity-85 hover:opacity-100'>
                                                    &lt;
                                                </button>
                                                <button onClick={(e) => { e.preventDefault(); handleNextClick(index); }} className='absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full opacity-85 hover:opacity-100'>
                                                    &gt;
                                                </button> */} 
                                               
                                                <div className='flex flex-col gap-0 p-1 m-1 capitalize'>
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
