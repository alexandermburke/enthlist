'use client'
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ActionCard from './ActionCard';
import Link from 'next/link';
import InputWrapper from './InputWrapper';
import { Open_Sans } from 'next/font/google';
import LogoFiller from './LogoFiller';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Modal from './Modal';

const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});

export default function Listing() {
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
        images: [] // Array to store multiple image URLs
    };
    let defaultSellerData = {
        city: '',
        state: '',
        instagram: '',
        contactname: '',
        sellertype: ''
    };

    const applicationDataOrder = ['company', 'status', 'model', 'miles', 'exterior', 'seats', 'interior', 'transmission']; 
    const sellerDataOrder = ['city', 'instagram', 'state', 'contactname', 'sellertype'];

    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData);
    const [sellerMeta, setSellerMeta] = useState(defaultSellerData);
    const [carDescription, setCarPosting] = useState('');
    const [imagePostings, setImagePostings] = useState([]); // Array to store multiple image URLs
    const [isLoading, setIsLoading] = useState(false);

    const { userDataObj, currentUser, setUserDataObj } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const onDrop = async (acceptedFiles) => {
        uploadImages(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] }, multiple: true });

    const uploadImages = async (imageFiles) => {
        setIsLoading(true);
        
        try {
            const urls = await Promise.all(imageFiles.map(async (file) => {
                const storageRef = ref(storage, `images/${file.name}`);
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);
                return imageUrl;
            }));
            setImagePostings(prev => [...prev, ...urls]);
        } catch (error) {
            console.error("Error uploading images: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) {
            uploadImages(Array.from(files));
        }
    };

    const labelMapping = {
        company: 'Make',
        model: 'Model',
        year: 'Year',
        status: 'Title',
        id: 'VIN',
        miles: 'Miles',
        exterior: 'Exterior',
        interior: 'Interior',
        seats: 'Seats',
        transmission: 'Trans',
        price: 'Asking Price',
        images: 'Images',
        city: 'City',
        sellertype: 'Type',
        contactname: 'Name',
        state: 'State',
        instagram: 'Instagram'
    };

    useEffect(() => {
        if (!userDataObj || !searchParams) return;
        const applicationName = searchParams.get('id');
        if (!applicationName) {
            console.error("No application ID found in URL parameters.");
            return;
        }

        const fetchData = async () => {
            let listings = userDataObj?.listings || {};
            if (applicationName in listings) {
                const coverLetter = listings[applicationName];
                const { applicationMeta: localApplicationMeta, carDescription: localCarPosting } = coverLetter;
                setApplicationMeta(localApplicationMeta || defaultApplicationData);
                setCarPosting(localCarPosting || '');
                setImagePostings(localApplicationMeta?.images || []);
            } else {
                try {
                    const docRef = doc(db, 'listings', applicationName);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Fetched data from Firebase:", data); // Logging fetched data
                        
                        // Extract the data based on the fetched structure
                        const listingData = data[applicationName];
                        if (listingData) {
                            setApplicationMeta(listingData.applicationMeta || defaultApplicationData);
                            setSellerMeta(listingData.SellerMeta || defaultSellerData);
                            setCarPosting(listingData.carDescription || '');
                            setImagePostings(listingData.applicationMeta?.images || []);
                        } else {
                            console.error("No listing data found for ID:", applicationName);
                        }
                    } else {
                        console.error("No document found in Firebase with ID:", applicationName);
                    }
                } catch (error) {
                    console.error("Error fetching document from Firebase:", error);
                }
            }
        };

        fetchData();
    }, [userDataObj, searchParams]);

    useEffect(() => {
        console.log("Updated applicationMeta:", applicationMeta); // Debugging
        setImagePostings(applicationMeta.images || []);
    }, [applicationMeta]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [transitions, setTransitions] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedImage, setSelectedImage] = useState(''); // State to manage selected image for modal

    const openModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    const handlePrevClick = () => {
        setSelectedImage(imagePostings[(currentImageIndex - 1 + imagePostings.length) % imagePostings.length]);
        setCurrentImageIndex((currentImageIndex - 1 + imagePostings.length) % imagePostings.length);
    };

    const handleNextClick = () => {
        setSelectedImage(imagePostings[(currentImageIndex + 1) % imagePostings.length]);
        setCurrentImageIndex((currentImageIndex + 1) % imagePostings.length);
    };

    useEffect(() => {
        if (imagePostings.length > 1) {
            const intervalId = setInterval(() => {
                setTransitions(true);
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imagePostings.length);
            }, 15000); // Change image every 15 seconds

            return () => clearInterval(intervalId);
        }
    }, [imagePostings.length]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTransitions(false);
        }, 500); // Duration of CSS transition

        return () => clearTimeout(timeoutId);
    }, [currentImageIndex]);

    if (!applicationMeta.id) {
        return (
            <>
                <p className={'font-medium text-lg blueGradient sm:text-xl md:text-1xl py-2 flex items-center'}>{'Loading Please Wait .. '} </p>
                <LogoFiller />
            </>
        );
    }

    return (
        <>
         
            <div className='flex flex-col gap-8 flex-1 capitalize '>
                <div className='flex items-center justify-between gap-4'>
                    <Link href={'/browse'} className='flex items-center mr-auto justify-center gap-4 bg-white px-4 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                        <p className=''>&larr; Back</p>
                    </Link>
                </div>

                {/*  images transform  */}
                <ActionCard title={`${applicationMeta.year} ${applicationMeta.company} ${applicationMeta.model}`} priceTitle={applicationMeta.price}>
                    <div className='grid grid-cols-1 gap-4 '>
                        <div className='relative rounded-2xl border border-solid border-indigo-50 duration-200 overflow-hidden blueShadow max-h-128 max-w-128'>
                            <div className="slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: transitions ? 'transform 0.5s ease-in-out' : 'none', display: 'flex' }}>
                                {imagePostings.map((image, index) => (
                                  <div key={index} className="relative w-full flex-shrink-0">
                                      <img 
                                          src={image} 
                                          alt={`slide-${index}`} 
                                          className="image max-h-128 max-w-128 cursor-pointer" 
                                          style={{ width: '100%', flex: 'none' }} 
                                          onClick={() => openModal(image)}
                                      />
                                  </div>
                                ))}
                            </div>
                            <button onClick={handlePrevClick} className='absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-2 py-6 rounded-full opacity-75 hover:opacity-100'>
                                &lt;
                            </button>
                            <button onClick={handleNextClick} className='absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-2 py-6 rounded-full opacity-75 hover:opacity-100'>
                                &gt;
                            </button>
                        </div>
                    </div>
                </ActionCard>

                {/*  car listing details  */}
                <ActionCard title={'Car Listing Details'} subTitle={applicationMeta.id}>
                    <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
                        {applicationDataOrder.map((entry, entryIndex) => (
                            <div className='flex items-center gap-4 ' key={entryIndex}>
                                <p className='capitalize font-semibold w-24 sm:w-32'>{labelMapping[entry]}</p>
                                <input
                                    className='bg-transparent capitalize w-full outline-none border-none'
                                    placeholder={applicationMeta[entry]}
                                    value={applicationMeta[entry]}
                                    onChange={(e) => setApplicationMeta({ ...applicationMeta, [entry]: e.target.value })}
                                />   
                            </div>
                        ))}
                    </div>

                    {/*  contact seller   */}
                    <div className='flex items-center gap-4'>
                        <p className={'font-medium text-lg blueGradient sm:text-xl md:text-1xl py-2'}>{'Contact Seller'} </p>
                        <p className="opacity-80 text-xs sm:text-sm italic capitalize">{'Beta Version'}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    {sellerDataOrder.map((entry, entryIndex) => (
                            <div className='flex items-center gap-4' key={entryIndex}>
                                <p className='capitalize font-semibold w-30 sm:w-36'>{labelMapping[entry]}</p>
                                <input
                                    className='bg-transparent capitalize w-full outline-none border-none'
                                    placeholder={sellerMeta[entry]}
                                    value={sellerMeta[entry]}
                                    onChange={(e) => setSellerMeta({ ...sellerMeta, [entry]: e.target.value })}
                                />   
                            </div>
                        ))}
                    </div>
                    
                                {/* div for spacing */} 
                              <div className='grid grid-cols-1 shrink-0'/>
                              <div className='grid grid-cols-1 shrink-0'/>
                             
                        
                        {/*  car listing detail buttons  */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                             <Link href={'/browse/message?id=' + (applicationMeta?.id || listing.id)} className='duration-200 overflow-hidden p-0.5 rounded-full relative flex items-center w-48 sm:w-58'>
                                           <div className='absolute inset-0 blueBackground' />
                                        <div className='h-10 px-3 py-2 flex items-center justify-between relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white w-full'>
                                        <p className=''>Message Seller</p>
                                       <i className="fa-regular fa-comments"></i>
                                    </div>
                                 </Link>

                                 <button onClick={() => {}} className='flex items-center w-48 sm:w-58 justify-center gap-2 border border-solid border-white px-3 py-2 bg-indigo-50 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                                   <p className=''>Report Listing</p>
                                 </button>
                            </div>
                </ActionCard>

                {/*  description  */}
                <ActionCard title={'Description'}>
                    <InputWrapper value={carDescription}>
                        <textarea value={carDescription} placeholder='No description ...' onChange={(e) => setCarPosting(e.target.value)} className='unstyled h-full resize-none absolute inset-0'></textarea>
                    </InputWrapper>
                </ActionCard>
            </div>

            {/* Modal for enlarged image */}
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                imageSrc={selectedImage}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
            />
        </>
    );
}
