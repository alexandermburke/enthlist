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
import { doc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from './Modal';

const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});

export default function Application() {
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
        image: ''
    };
    let defaultSellerData = {
        city: '',
        instagram: '',
        state: '',
        contactname: '',
        sellertype: ''
    };
    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData);
    const [SellerMeta, setSellerMeta] = useState(defaultSellerData);
    const [application, setApplication] = useState('');
    const [carDescription, setCarPosting] = useState('');
    const [imagePosting, setImagePosting] = useState('');
    const [changedData, setChangedData] = useState(false);
    const [savingData, setSavingData] = useState(false);
    const [applicationID, setApplicationID] = useState('');
    const [showStatuses, setShowStatuses] = useState(false);
    const [showModal, setShowModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { userDataObj, currentUser, setUserDataObj, isPaid } = useAuth();
    let apiCalls = userDataObj?.billing?.apiCalls || 0;

    const router = useRouter();
    const searchParams = useSearchParams();

    const onDrop = async (acceptedFiles) => {
        const imageFile = acceptedFiles[0];
        uploadImage(imageFile);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] } });

    const uploadImage = async (imageFile) => {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        
        setIsLoading(true);
        setError(null);
        
        try {
            await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);
            await addDoc(collection(db, 'imageposting'), {
                imageUrl,
            });
            setImagePosting(imageUrl);
        } catch (error) {
            console.error("Error uploading image: ", error);
            setError("Failed to upload image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const placeHolders = {
        company: 'BMW', model: 'M3', year: '2018', status: 'clean', miles: '10,000', exterior: 'alpine white', interior: 'black', seats: 'competition', transmission: 'DCT', price: '$50,000', image: ''
    };
    const secondaryplaceHolders = {
        state: 'Washington', sellertype: 'Dealership', city: 'Seattle', contactname: 'Alex', instagram: 'alex.burke29'
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
        image: 'Image',
        city: 'City',
        sellertype: 'Seller Type', // updated label for sellertype
        contactname: 'Contact Name',
        state: 'State',
        instagram: 'Instagram'
    };

    function handleSubmitListing() {
        if (!applicationID || applicationID.length < 17) { return }
        router.push('/admin/application?id=' + applicationID);
    }

    function updateUserData(type, val) {
        setApplicationMeta({ ...applicationMeta, [type]: val });
        setChangedData(true);
    }

    function handleCancelDetails() {
        let currData = localStorage.getItem('hyr');
        let localApplicationMeta;
        if (currData) {
            localApplicationMeta = JSON.parse(currData).localApplicationMeta || defaultApplicationData;
        } else {
            localApplicationMeta = defaultApplicationData;
        }
        setApplicationMeta(localApplicationMeta);
        setChangedData(false);
    }

    async function handleSaveListing() {
        if (savingData || isResponding) { return; }
        setSavingData(true);
    
        try {
            const currData = localStorage.getItem('hyr') ? JSON.parse(localStorage.getItem('hyr')) : {};
            const newListing = {
                [applicationMeta.id]: {
                    applicationMeta: { ...applicationMeta, image: imagePosting },
                    carDescription,
                    sellerMeta
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
            setSavingData(false);
        }
    }
    

    const isReady = carDescription && applicationMeta.company && applicationMeta.role;
   
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
        const { applicationMeta: localApplicationMeta, carDescription: localJobPosting, imagePosting: localImagePosting, application: localApplication } = coverLetter;
        localApplicationMeta && setApplicationMeta(localApplicationMeta);
        localJobPosting && setCarPosting(localJobPosting);
        localImagePosting && setImagePosting(localImagePosting);
        localApplication && setApplication(localApplication);
    }, [userDataObj, searchParams]);

    function sortDetails(arr) {
        const order = ['company', 'price', 'model', 'exterior', 'year', 'interior', 'miles', 'seats', 'transmission', 'status', 'image'];
        return [...arr].sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b);
        });
    }

  
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
   

    const modalContent = {
        confirmed: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>Listing generator</p>
                <p>You have <b>{3 - apiCalls}</b> free listings remaining.</p>
                <p className='flex-1'>Upgrading your account allows <b>unlimited</b> listing generations! <br />
                    <Link className='blueGradient' href={'/admin/billing'}>Upgrade here &rarr;</Link></p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className='w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 px-8 duration-200 hover:opacity-70'>Go back</button>
                 
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
            <div className='flex flex-col gap-8 flex-1 capitalize '>
                <div className='flex items-center justify-between gap-4'>
                    <Link href={'/browse'} className='flex items-center mr-auto justify-center gap-4 bg-white px-4 py-2 rounded-full text-indigo-400 duration-200 hover:opacity-50'>
                        <p className=''>&larr; Back</p>
                    </Link>
              
                </div>
                <ActionCard title={applicationMeta?.year + ' ' + applicationMeta?.company + ' ' + applicationMeta?.model} subTitle={''}>
                <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 '>
                <div className='rounded-2xl border border-solid border-indigo-50 duration-200 overflow-hidden blueShadow '>
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
                </div>
                </div>

                </ActionCard>

                <ActionCard title={'Car Listing Details'} subTitle={applicationMeta.id}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
                        {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id' && val !== 'image').map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className='capitalize font-medium w-24 sm:w-32'>{labelMapping[entry]}{['company', 'role'].includes(entry) ? '' : ''}</p>
                                    {entry === 'status' ? (
                                        <div className='flex flex-col gap-1 w-full relative'>
                                            <label>
                                                <p className='capitalize'>{applicationMeta.status}</p>     
                                            </label>
                                            {showStatuses && (
                                                <div className='flex flex-col border-l rounded-b-lg border-b border-r border-solid border-slate-100 bg-white z-[10] absolute top-full left-0 w-full'>
                                                    {[''].map((stat, statIndex) => {
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
                                           />   
                                    )}
                                </div>
                            );
                        })}
                    </div>

       <div className='flex items-center gap-4'>
                    <p className={'font-medium ' + ('text-lg blueGradient sm:text-xl md:text-1xl py-2')}>{'Contact Seller'} </p>
                    <p className="opacity-80 text-xs sm:text-sm italic capitalize">{'Beta Testing'}</p>
       </div>
                    
                    <div className='grid grid-cols-2 sm:grid-cols-2 gap-3'>
                   {sortDetails(Object.keys(SellerMeta)).map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className='capitalize font-medium w-24 sm:w-32'>{labelMapping[entry]}{['company', 'role'].includes(entry) ? '' : ''}</p>
                                    {entry === 'status' ? (
                                        <div className='flex flex-col gap-1 w-full relative'>
                                            <label>
                                                <p className='capitalize'>{sellerMeta.status}</p>     
                                            </label>
                                            {showStatuses && (
                                                <div className='flex flex-col border-l rounded-b-lg border-b border-r border-solid border-slate-100 bg-white z-[10] absolute top-full left-0 w-full'>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            className='bg-transparent capitalize w-full outline-none border-none'
                                            placeholder={secondaryplaceHolders[entry]}
                                            value={SellerMeta[entry]}
                                           />   
                                    )}
                                </div>
                            );
                        })}
                    </div>
                 

                </ActionCard>
                <ActionCard title={'Description'}>
                    <InputWrapper value={carDescription}>
                        <textarea value={carDescription} placeholder='No description ...' onChange={(e) => {
                  //          setCarPosting(e.target.value);
                        }} className='unstyled h-full resize-none absolute inset-0 max-h-[600px]'></textarea>
                    </InputWrapper>
                </ActionCard>
              
                {application && (
                    <div className='grid grid-cols-2 gap-4 sm:w-fit'>
                        <button onClick={handleSaveListing} className='flex items-center justify-center gap-2 border border-solid border-white bg-white p-4 rounded-full text-blue-400 duration-200 hover:opacity-50'>
                            <p className=''>{savingData ? 'Saving' : 'Save'}</p>
                            <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                        <Link href={'/listing/' + applicationMeta.id} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-blue-100 bg-white p-4 rounded-full text-blue-400 duration-200 hover:opacity-50 ' + (!isReady ? 'opacity-50' : '')}>
                            <p className=''>PDF Viewer</p>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
