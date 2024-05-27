'use client'
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ActionCard from './ActionCard';
import Link from 'next/link';
import InputWrapper from './InputWrapper';
import { Open_Sans } from 'next/font/google';
import Button from './Button';
import LogoFiller from './LogoFiller';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/firebase';
import { doc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
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
    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData);
    const [SellerMeta, setSellerMeta] = useState(defaultSellerData);
    const [carDescription, setCarPosting] = useState('');
    const [imagePostings, setImagePostings] = useState([]); // Array to store multiple image URLs
    const [applicationID, setApplicationID] = useState('');
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
        company: 'Company',
        model: 'Model',
        year: 'Year',
        status: 'Status',
        id: 'ID',
        miles: 'Miles',
        exterior: 'Exterior',
        interior: 'Interior',
        seats: 'Seats',
        transmission: 'Transmission',
        price: 'Price',
        images: 'Images',
        city: 'City',
        sellertype: 'Seller Type',
        contactname: 'Contact Name',
        state: 'State',
        instagram: 'Instagram'
    };

    useEffect(() => {
        if (!userDataObj || !searchParams) { return }
        const applicationName = searchParams.get('id');
        let listings = userDataObj?.listings || {};
        if (!applicationName) {
            return;
        }
        setApplicationMeta(curr => ({ ...curr, id: applicationName }));
        if (!(applicationName in listings)) { return }
        const coverLetter = listings[applicationName];
        const { applicationMeta: localApplicationMeta, carDescription: localJobPosting } = coverLetter;
        console.log("Fetched applicationMeta:", localApplicationMeta); // Debugging
        localApplicationMeta && setApplicationMeta(localApplicationMeta);
        localJobPosting && setCarPosting(localJobPosting);
    }, [userDataObj, searchParams]);

    useEffect(() => {
        console.log("Updated applicationMeta:", applicationMeta); // Debugging
        setImagePostings(applicationMeta.images || []);
    }, [applicationMeta]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [transitions, setTransitions] = useState({});

    useEffect(() => {
        if (imagePostings.length > 1) {
            const intervalId = setInterval(() => {
                setTransitions(true);
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imagePostings.length);
            }, 25000); // Change image every 15 seconds

            return () => clearInterval(intervalId);
        }
    }, [imagePostings.length]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTransitions(false);
        }, 500); // Duration of CSS transition

        return () => clearTimeout(timeoutId);
    }, [currentImageIndex]);

    const handlePrevClick = () => {
        setTransitions(true);
        setCurrentImageIndex(prevIndex => (prevIndex - 1 + imagePostings.length) % imagePostings.length);
    };

    const handleNextClick = () => {
        setTransitions(true);
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % imagePostings.length);
    };

    if (!applicationMeta.id) {
        return (
            <>
                  <p className={'font-medium text-lg blueGradient sm:text-xl md:text-1xl py-2'}>{'Error'} </p>
                   
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
                <ActionCard title={`${applicationMeta.year} ${applicationMeta.company} ${applicationMeta.model}`} subTitle={''}>
                    <div className='grid grid-cols-1 gap-4 '>
                        <div className='relative rounded-2xl border border-solid border-indigo-50 duration-200 overflow-hidden blueShadow max-h-128 max-w-128'>
                            <div className="slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: transitions ? 'transform 0.5s ease-in-out' : 'none', display: 'flex' }}>
                                {imagePostings.map((image, index) => (
                                  <img key={index} src={image} alt={`slide-${index}`} className="image max-h-128 max-w-128" style={{ width: '100%', flex: 'none' }} />
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {Object.keys(applicationMeta).filter(val => val !== 'id' && val !== 'images').map((entry, entryIndex) => (
                            <div className='flex items-center gap-4' key={entryIndex}>
                                <p className='capitalize font-medium w-24 sm:w-32'>{labelMapping[entry]}</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.keys(SellerMeta).map((entry, entryIndex) => (
                            <div className='flex items-center gap-4' key={entryIndex}>
                                <p className='capitalize font-medium w-30 sm:w-36'>{labelMapping[entry]}</p>
                                <input
                                    className='bg-transparent capitalize w-full outline-none border-none'
                                    placeholder={SellerMeta[entry]}
                                    value={SellerMeta[entry]}
                                    onChange={(e) => setSellerMeta({ ...SellerMeta, [entry]: e.target.value })}
                                />   
                            </div>
                        ))}
                    </div>

                    {/*  car listing detail buttons  */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <button onClick={() => {}} className='flex items-center w-48 sm:w-58 justify-center blueShadow gap-2 border border-solid border-white px-3 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                            <p className=''>Message Seller</p>
                            <i className="fa-regular fa-comments"></i>
                        </button>
                        <button onClick={() => {}} className='flex items-center w-48 sm:w-58 justify-center gap-2 border border-solid border-white px-3 py-2 bg-indigo-50 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                            <p className=''>Report Listing</p>
                        </button>
                    </div>
                </ActionCard>

                {/*  description  */}
                <ActionCard title={'Description'}>
                    <InputWrapper value={carDescription}>
                        <textarea value={carDescription} placeholder='No description ...' onChange={(e) => setCarPosting(e.target.value)} className='unstyled h-full resize-none absolute inset-0 max-h-[600px]'></textarea>
                    </InputWrapper>
                </ActionCard>
            </div>
        </>
    );
}
