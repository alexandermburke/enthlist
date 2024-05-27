'use client'
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ActionCard from './ActionCard';
import Link from 'next/link';
import InputWrapper from './InputWrapper';
import ImageWrapper from './ImageWrapper';
import { Open_Sans } from 'next/font/google';
import Button from './Button';
import LogoFiller from './LogoFiller';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/firebase';
import { doc, updateDoc, setDoc, collection } from 'firebase/firestore';
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
    const [showStatuses, setShowStatuses] = useState(false);
    const [showModal, setShowModal] = useState(null);
    const [error, setError] = useState(null);

    const { userDataObj, currentUser, setUserDataObj } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const onDrop = async (acceptedFiles) => {
        uploadImages(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] }, multiple: true });

    const uploadImages = async (imageFiles) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const urls = await Promise.all(imageFiles.map(async (file) => {
                const storageRef = ref(storage, `images/${file.name}`);
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);
                return imageUrl;
            }));
            setImagePostings(prev => [...prev, ...urls]);
            
            // Save the URLs to Firestore
            const listingsRef = doc(db, 'listings', applicationMeta.id);
            await updateDoc(listingsRef, {
                'applicationMeta.images': [...applicationMeta.images, ...urls]
            });
        } catch (error) {
            console.error("Error uploading images: ", error);
            setError("Failed to upload images");
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

    const placeHolders = {
        company: 'BMW', model: 'M3', year: '2018', status: 'clean', miles: '10,000', exterior: 'alpine white', interior: 'black', seats: 'competition', transmission: 'DCT', price: '$50,000', image: ''
    };

    function handleSubmitListing() {
        if (!applicationID || applicationID.length < 17) { return }
        router.push('/admin/application?id=' + applicationID);
    }

    function updateUserData(type, val) {
        setApplicationMeta({ ...applicationMeta, [type]: val });
    }

    async function handleSaveListing() {
        setIsLoading(true);
    
        try {
            const currData = localStorage.getItem('hyr') ? JSON.parse(localStorage.getItem('hyr')) : {};
            const newListing = {
                [applicationMeta.id]: {
                    applicationMeta: { ...applicationMeta, images: imagePostings },
                    carDescription,
                    SellerMeta
                }
            };
    
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                listings: {
                    ...(currData.listings || {}),
                    ...newListing
                }
            });
    
            const listingsRef = doc(db, 'listings', applicationMeta.id);
            await setDoc(listingsRef, newListing);
    
            const newData = { ...currData, listings: { ...(currData.listings || {}), ...newListing } };
            localStorage.setItem('hyr', JSON.stringify(newData));
            setUserDataObj(curr => ({ ...curr, listings: newData.listings }));
        } catch (err) {
            console.error('Failed to save data:', err);
        } finally {
            setIsLoading(false);
        }
    }
    
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
        const { applicationMeta: localApplicationMeta, carDescription: localJobPosting, application: localApplication } = coverLetter;
        localApplicationMeta && setApplicationMeta(localApplicationMeta);
        localJobPosting && setCarPosting(localJobPosting);
        setImagePostings(localApplicationMeta?.images || []);
        localApplication && setApplication(localApplication);
    }, [userDataObj, searchParams]);

    function sortDetails(arr) {
        const order = ['company', 'price', 'model', 'exterior', 'year', 'interior', 'miles', 'seats', 'transmission', 'status', 'images'];
        return [...arr].sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b);
        });
    }

    if (!applicationMeta.id) {
        return (
            <>
                <ActionCard title={'New listing'} lgHeader noFlex>
                    <p className=''>Provide the VIN for your car!</p>
                    <p className='font-medium'>VIN</p>
                    <div className='flex flex-col gap-1'>
                        <p className='opacity-40 text-xs sm:text-sm italic'>• This VIN cannot be repurposed.</p>
                        <p className='opacity-40 text-xs sm:text-sm italic'>• VIN must be 17 characters.</p>
                    </div>
                    <input value={applicationID} onChange={(e) => { setApplicationID(e.target.value) }} className='bg-white border rounded-lg border-solid border-indigo-100 w-full outline-none p-2' placeholder='Enter the VIN here' />
                    <div className='flex items-stretch justify-between gap-4'>
                        <Link href={'/admin'} className='flex items-center mr-auto justify-center gap-4 bg-white border border-solid border-indigo-100 px-4 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                            <p className=''>&larr; Back</p>
                        </Link>
                        <button onClick={handleSubmitListing} className='flex items-center justify-center gap-2 border border-solid border-white bg-indigo-50 px-3 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                            <p className=''>Create</p>
                            <i className="fa-regular fa-circle-check"></i>
                        </button>
                    </div>
                </ActionCard>
                <LogoFiller />
            </>
        );
    }

    const modalContent = {
        confirmed: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>Listing generator</p>
                <p>You have free listings remaining.</p>
                <p className='flex-1'>Upgrading your account allows <b>unlimited</b> listing generations! <br />
                    <Link className='blueGradient' href={'/admin/billing'}>Upgrade here &rarr;</Link></p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className='w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 px-8 duration-200 hover:opacity-70'>Go back</button>
                     <Button text={'Confirm generation'} clickHandler={() => {}} />
                </div>
            </div>
        ),
        blocked: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>You&apos;ve used up your free generations!</p>
                <p>Please upgrade your account to continue using this feature.</p>
                <p className=''><i>You can also use the Copy Prompt feature to generate a cover letter via your own ChatGPT instance.</i></p>
                <p className='flex-1'>Upgrading your account also allows you to create and manage numerous additional cover letters!</p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className='w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 px-8 duration-200 hover:opacity-60'>Go back</button>
                    <Button text={'Upgrade account'} clickHandler={() => { router.push('/admin/billing') }} />
                </div>
            </div>
        )
    };

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {modalContent[showModal]}
                </Modal>
            )}
            <div className='flex flex-col gap-8 flex-1'>
                <div className='flex items-center justify-between gap-4'>
                    <Link href={'/admin'} className='flex items-center mr-auto justify-center gap-4 bg-white px-4 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                        <p className=''>&larr; Back</p>
                    </Link>
                    <button onClick={handleSaveListing} className='flex items-center justify-center gap-2 border border-solid border-white bg-indigo-50 px-3 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                        <p className=''>{isLoading ? 'Uploading' : 'Upload'}</p>
                        <i className="fa-solid fa-upload"></i>
                    </button>
                </div>
                <ActionCard title={'Car Listing Details'} subTitle={applicationMeta.id}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id' && val !== 'images').map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className='capitalize font-medium w-24 sm:w-32'>{entry}{['company', 'role'].includes(entry) ? '' : ''}</p>
                                    {entry === 'status' ? (
                                        <div className='flex flex-col gap-1 w-full relative'>
                                            <button onClick={() => {
                                                setShowStatuses(!showStatuses)
                                            }} className={'flex items-center gap-4 justify-between p-2 border border-solid border-slate-100 rounded-t-lg ' + (showStatuses ? '' : ' rounded-b-lg')}>
                                                <p className='capitalize'>{applicationMeta.status || 'Select status'}</p>
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </button>
                                            {showStatuses && (
                                                <div className='flex flex-col border-l rounded-b-lg border-b border-r border-solid border-slate-100 bg-white z-[10] absolute top-full left-0 w-full'>
                                                    {['clean', 'rebuilt', 'salvage', 'lemon', 'other',].map((stat, statIndex) => {
                                                        return (
                                                            <button onClick={() => {
                                                                updateUserData('status', stat);
                                                                setShowStatuses(false);
                                                            }} className='p-2 capitalize' key={statIndex}>
                                                                <p className={'duration-200 ' + (stat === applicationMeta.status ? 'font-medium' : '')}>{stat}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            className='bg-transparent capitalize w-full outline-none border-none'
                                            placeholder={placeHolders[entry]}
                                            value={applicationMeta[entry]}
                                            onChange={(e) => updateUserData(entry, e.target.value)} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className='flex flex flex-col sm:items-center sm:flex-row gap-4'>
                        <p className='capitalize font-medium'>Money still owed on vehicle</p>
                        <div className='grid grid-cols-2 gap-4'>
                            {[true, false].map((val, valIndex) => {
                                return (
                                    <button onClick={() => {}} key={valIndex} className={'flex items-center gap-2 group'}>
                                        <div className={'h-4 aspect-square rounded border border-gray-500 duration-200 border-solid ' + ((val === true) ? 'bg-gray-500' : 'group-hover:bg-gray-500')} />
                                        <p className={'duration-200 whitespace-nowrap ' + ((val === true) ? '' : 'text-slate-500')}>{val ? 'Yes' : "No"}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ActionCard>
                <ActionCard title={'Description'}>
                    <InputWrapper value={carDescription}>
                        <textarea value={carDescription} placeholder='Paste the listing description here ...' onChange={(e) => {
                            setCarPosting(e.target.value);
                        }} className='unstyled h-full resize-none absolute inset-0 max-h-[600px]'></textarea>
                    </InputWrapper>
                </ActionCard>
                <ActionCard title={'Media'}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {imagePostings.map((url, index) => (
                            <ImageWrapper key={index} value={url} isLoading={isLoading} error={error} />
                        ))}
                    </div>
                    <input type="file" accept="image/jpeg, image/png" multiple onChange={handleFileChange} className="file-input" />
                    <p className='opacity-80 text-xs sm:text-sm italic'>Format: *.jpg, *.jpeg, *.png only</p>
                    <p className='opacity-80 text-xs sm:text-sm italic'>Please wait until all pictures are displayed before uploading</p>
                </ActionCard>
                {applicationMeta.id && (
                    <div className='grid grid-cols-2 gap-4 sm:w-fit'>
                        <button onClick={handleSaveListing} className='flex items-center justify-center gap-2 border border-solid border-white bg-white p-4 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                            <p className=''>{isLoading ? 'Saving' : 'Save'}</p>
                            <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                        <Link href={'/listing/' + applicationMeta.id} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-indigo-100 bg-white p-4 rounded-full text-indigo-400 duration-200 hover:opacity-50 ' + (!carDescription || !applicationMeta.company ? 'opacity-50' : '')}>
                            <p className=''>PDF Viewer</p>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
