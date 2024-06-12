'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React from 'react';
import ActionCard from './ActionCard';
import FilterCard from './FilterCard';
import SearchBtn from './SearchButton';
import LogoFiller from './LogoFiller';
import Modal from './Modal';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { filterOptions, sortOptions } from '../utils/filterOptions';
import Head from 'next/head';

const ITEMS_PER_PAGE = 4;
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
        images: []
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

    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData);
    const [showModal, setShowModal] = useState(null);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [transitions, setTransitions] = useState({});
    const { currentUser, userDataObj } = useAuth();

    const [isFilterTabVisible, setIsFilterTabVisible] = useState(false); // State for filter tab visibility
    const [isSortbyTabVisible, setIsSortbyTabVisible] = useState(false); // State for sort by tab visibility
    const [currentPage, setCurrentPage] = useState(1);
    const [fadeTransition, setFadeTransition] = useState(false);
    
    const [showStatuses, setShowStatuses] = useState(false);
    const [dropdownVisibility, setDropdownVisibility] = useState({});
    const [sortOption, setSortOption] = useState('');
    const [showSortOptions, setShowSortOptions] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [listingData, setListingData] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()[doc.id] }));
                console.log("Listings Data:", listingsData);
                setListings(listingsData);
                setFilteredListings(listingsData); // Initialize filteredListings with all listings
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

    const handlePageChange = (pageNumber) => {
        setFadeTransition(true);
        setTimeout(() => {
            setCurrentPage(pageNumber);
            setFadeTransition(false);
        }, 300); // Duration of the fade-out transition
    };

    const paginatedListings = filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleFilter = () => {
        setFilteredListings(listings.filter(listing => {
            return Object.keys(applicationMeta).every(key => {
                if (key === 'images') return true;
                return applicationMeta[key] === '' || listing.applicationMeta[key].toLowerCase().includes(applicationMeta[key].toLowerCase());
            });
        }));
        setCurrentPage(1);
    };

    const handleDropdownChange = (value, key) => {
        setApplicationMeta({
            ...applicationMeta,
            [key]: value
        });
        setDropdownVisibility({
            ...dropdownVisibility,
            [key]: false
        });
    };

    const toggleDropdown = (key) => {
        setDropdownVisibility({
            ...dropdownVisibility,
            [key]: !dropdownVisibility[key]
        });
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setShowSortOptions(false);
        // Sort the filtered listings based on the selected option
        const sortedListings = [...filteredListings].sort((a, b) => {
            switch (option) {
                case 'price_desc':
                    return parseFloat(b.applicationMeta.price.replace(/[$,]/g, '')) - parseFloat(a.applicationMeta.price.replace(/[$,]/g, ''));
                case 'price_asc':
                    return parseFloat(a.applicationMeta.price.replace(/[$,]/g, '')) - parseFloat(b.applicationMeta.price.replace(/[$,]/g, ''));
                case 'mileage_desc':
                    return parseFloat(b.applicationMeta.miles.replace(/[,]/g, '')) - parseFloat(a.applicationMeta.miles.replace(/[,]/g, ''));
                case 'mileage_asc':
                    return parseFloat(a.applicationMeta.miles.replace(/[,]/g, '')) - parseFloat(b.applicationMeta.miles.replace(/[,]/g, ''));
                case 'year_desc':
                    return parseInt(b.applicationMeta.year) - parseInt(a.applicationMeta.year);
                case 'year_asc':
                    return parseInt(a.applicationMeta.year) - parseInt(b.applicationMeta.year);
                default:
                    return 0;
            }
        });
        setFilteredListings(sortedListings);
    };

    // Toggle constants
    const toggleFilterTab = () => {
        setIsFilterTabVisible(!isFilterTabVisible);
    };

    useEffect(() => {
        const fetchListingData = async (id) => {
            try {
                const docRef = doc(db, 'listings', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setListingData(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching listing data:', error);
            }
        };

        const path = pathname;
        const match = path.match(/\/listing\/(\w+)/);
        if (match) {
            const id = match[1];
            fetchListingData(id);
        }
    }, [pathname]);

    const defaultDescription = "Superfast cool vehicles for sale";
    const defaultImage = "/default-image.jpg";

    return (
        <>
            <Head>
                <title>{listingData ? `${listingData.year} ${listingData.company} ${listingData.model}` : "Listing"}</title>
                <meta
                    name="description"
                    content={listingData ? listingData.carDescription : defaultDescription}
                />
                <meta property="og:title" content={listingData ? `${listingData.year} ${listingData.company} ${listingData.model}` : "Listing"} />
                <meta property="og:description" content={listingData ? listingData.carDescription : defaultDescription} />
                <meta property="og:image" content={listingData && listingData.images.length > 0 ? listingData.images[0] : defaultImage} />
                <meta property="og:url" content={`https://yourdomain.com${pathname}`} />
                <meta property="og:type" content="website" />
            </Head>

            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {/* Add modal content here */}
                </Modal>
            )}

            <div className='flex flex-col gap-4 flex-none'>
                <SearchBtn centerAligned />
                <div className='flex justify-between items-center gap-4'>
                    <button onClick={toggleFilterTab} className='duration-200 overflow-hidden p-0.5 rounded-full relative'>
                        <div className='absolute inset-0 blueBackground' />
                        <div className={'h-10 px-12 flex items-center justify-between relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white ' + poppins.className}>
                            <p>{isFilterTabVisible ? 'Hide Filters' : 'Show Filters'}</p>
                        </div>
                    </button>
                    <div className='relative'>
                        <button onClick={() => setShowSortOptions(!showSortOptions)} className={'duration-200 overflow-hidden p-0.5 rounded-full relative' + poppins.className}>
                        <div className='absolute inset-0 blueBackground rounded-full' />
                        <div className={'h-10 px-12 flex items-center justify-between relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white ' + poppins.className}>
                            <p className='capitalize'>{sortOption ? sortOptions.find(opt => opt.value === sortOption).label : 'Sort by'}</p>
                            <i className="fa-solid fa-chevron-down ml-2"></i>
                            </div>
                        </button>
                        {showSortOptions && (
                            <div className='absolute right-0 mt-1 w-full rounded-b-lg border border-solid border-slate-100 bg-white z-10'>
                                {sortOptions.map((option, index) => (
                                    <button onClick={() => handleSortChange(option.value)} className='p-2 w-full text-left capitalize border-b border-solid border-slate-100 last:border-none' key={index}>
                                        <p className={'duration-200 ' + (option.value === sortOption ? 'font-medium' : '')}>{option.label}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                       {/* Filter tab */}
                <div className='flex gap-4'>
                   {isFilterTabVisible && (
                        <FilterCard title={'Filters'}>
                            <div className='flex flex-col gap-4'>
                                {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id' && val !== 'images' && val !== 'price' && val !== 'miles').map((entry, entryIndex) => {
                                    return (
                                        <div className='flex flex-col gap-1 w-full relative' key={entryIndex}>
                                            <button onClick={() => toggleDropdown(entry)} className={'flex items-center gap-4 justify-between p-2 border border-solid border-slate-100 rounded-t-lg ' + (dropdownVisibility[entry] ? '' : ' rounded-b-lg')}>
                                                <p className='capitalize'>{applicationMeta[entry] || `Select ${entry}`}</p>
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </button>
                                            {dropdownVisibility[entry] && (
                                                <div className='flex flex-col border-l rounded-b-lg border-b border-r border-solid border-slate-100 bg-white z-[10] absolute top-full left-0 w-full'>
                                                    {filterOptions[entry].map((option, optIndex) => {
                                                        return (
                                                            <button onClick={() => handleDropdownChange(option, entry)} className='p-2 capitalize' key={optIndex}>
                                                                <p className={'duration-200 ' + (option === applicationMeta[entry] ? 'font-medium' : '')}>{option}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {/* divs for spacing */}
                                <div className='flex gap-5'></div>
                                <div className='flex gap-5'></div>

                                {/* filter button */}
                                <button onClick={handleFilter} className='ml-1 duration-200 overflow-hidden p-0.5 rounded-full relative blueShadow'>
                                    <div className='absolute inset-0 blueBackground' />
                                    <p className='h-10 px-3 grid place-items-center relative z-10 bg-white rounded-full hover:bg-transparent hover:text-white'>{'Filter'}</p>
                                </button>
                            </div>
                        </FilterCard>
                    )}

                    {/* listing selection */}
                    <ActionCard title={'Listings'}>
                        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
                            <div className='grid grid-cols-1 shrink-0'>
                                {/* div for spacing */}
                            </div>
                            {paginatedListings.map((listing, index) => {
                                const { applicationMeta } = listing;
                                const currentImageIndex = currentImageIndexes[index] || 0;
                                const images = applicationMeta?.images || [];
                                return (
                                    <div className='grid grid-cols-1 gap-4' key={index}>
                                        <Link href={'/browse/listing?id=' + (applicationMeta?.id || listing.id)}>
                                            <div className='relative rounded-2xl border border-solid border-blue-50 duration-200 hover:bg-blue-50 overflow-hidden blueShadow hover:border-indigo-300 w-full'>
                                                <div className="slider flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: transitions[index] ? 'transform 0.5s ease-in-out' : 'none' }}>
                                                    {images.map((image, imgIndex) => (
                                                        <img key={imgIndex} src={image} alt={`slide-${imgIndex}`} className="w-full h-52 sm:h-100 object-cover flex-shrink-0" />
                                                    ))}
                                                </div>
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
                        <div className='flex justify-center mt-4'>
                            {Array.from({ length: Math.ceil(filteredListings.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`mx-1 px-3 py-1 rounded-full ${currentPage === pageNumber ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'}`}>
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </ActionCard>
                </div>
            </div>

            <LogoFiller />
        </>
    );
}
