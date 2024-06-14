'use client'
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

import Link from 'next/link';
import ActionCard from './ActionCard';
import LogoFiller from './LogoFiller';
import sortResumeSections from '@/utils';
import Modal from './Modal';
import Button from './Button';
import { useRouter } from 'next/navigation';
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });
const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});

const completionSteps = [
    ['Complete your listing', 'fa-solid fa-pen-to-square', 'Fill out your listing in the display below by adding all the sections you feel relevant to your car; remember to keep your description to approximately 1 page in length. You can view your listing by selecting the PDF Viewer button beneath, and can print the web page to a PDF that you can save to your local device. Be sure to adjust the print scale to get the perfect PDF fit.'],
    ['Upload pictures', 'fa-solid fa-scroll', 'Once you have completed your listing, complete all the details relevant to the car. Once you have added in the details in addition to pasting in the car, you can generate your perfect listing and make any final adjustments you feel necessary.'],
    ['Share your link', 'fa-solid fa-share', 'With your listing complete and saved, you can choose to publish your listing and have a live version at your special link. You can share this link with anyone!']
]


export default function Dashboard() {

    const [completedSteps, setCompletedSteps] = useState([])
    let defaultUserData = { name: '', email: '', website: '', location: '' }
    const [userData, setUserData] = useState(defaultUserData)
    const [changedData, setChangedData] = useState(false)
    const [resumeSections, setResumeSections] = useState([])
    const [addSection, setAddSection] = useState(false)
    const [showModal, setShowModal] = useState(null)
    const [ListingToDelete, setListingToDelete] = useState('')
    const [instruction, setInstruction] = useState(null)
    const [savingUserDetails, setSavingUserDetails] = useState(false)
    const [savingResume, setSavingResume] = useState(false)
    const [publishingResume, setPublishingResume] = useState(false) // show in modal
    const [nextFocusElement, setNextFocusElement] = useState(null)

    const router = useRouter()

    const { currentUser, loading, userDataObj, setUserDataObj, isPaid } = useAuth()
    let numberOfListings = Object.keys(userDataObj?.listings || {}).length



    // EDUCATION CRUD FUNCTIONS
    // SKILLS CRUD FUNCTIONS

    async function handleSaveResume() {
        if (savingResume) { return }

        let currData = localStorage.getItem('hyr')

        if (currData) {
            currData = JSON.parse(currData)
        } else {
            currData = {}
        }

        try {
            setSavingResume(true)
            let newData = { ...currData, resumeSections }
            setUserDataObj(curr => ({ ...curr, resumeSections }))
            localStorage.setItem('hyr', JSON.stringify(newData))
            const userRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(userRef, { resumeSections }, { merge: true });
            console.log(res)
        } catch (err) {
            console.log('Failed to save data\n', err.message)
        } finally {
            setSavingResume(false)
        }
    }

    function handleCreateListing() {
        if (numberOfListings >= 20) {
            // shouldn't be displaying button
            return
        }
        if (isPaid) {
            router.push('/admin/application')
           
            return
        }

        if (numberOfListings >= 10) {
            // prompt to upgrade account
            setShowModal('listings')
            return
        }
        router.push('/admin/application')
       
    }
    
    async function handleDeleteListing() {
        if (!ListingToDelete || !(ListingToDelete in userDataObj.listings)) { return; }
        
        const newListingsObj = { ...userDataObj.listings };
        delete newListingsObj[ListingToDelete];
        
        try {
            // Delete listing from Firestore
            const listingRef = doc(db, 'listings', ListingToDelete);
            await deleteDoc(listingRef);
    
            // Update user document to remove the listing reference
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                listings: newListingsObj
            });
    
            const newDataObj = { ...userData, listings: newListingsObj };
    
            // Update local userdata and set to local storage
            setUserDataObj(newDataObj);
            localStorage.setItem('hyr', JSON.stringify(newDataObj));
        } catch (err) {
            console.log('Failed to delete listing', err.message);
        } finally {
            setShowModal(null);
            setListingToDelete('');
        }
    }
    
    const modalContent = {
        listings: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>listing limit reached!</p>
                <p>Free accounts can manage up to 3 active listings.</p>
                <p className=''><i>Please either delete some listings, or upgrade your account to continue.</i></p>
                <p className='flex-1'>Upgrading your account allows you to manage up to <b>5</b> listings, and gives you access to auto <b> listing reposting.</b></p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className=' w-fit p-4 rounded-full mx-auto bg-white border border-solid border-indigo-100 px-8 duration-200 hover:opacity-60'>Go back</button>
                    <Button text={'Upgrade Account'} clickHandler={() => { router.push('/admin/billing') }} />
                </div>
            </div>
        ),
        publishing: (
            <div></div>
        ),
        deleteListing: (
            <div>
                <div className='flex flex-1 flex-col gap-4'>
                    <p className='font-medium text-lg sm:text-xl md:text-2xl'>Are you sure you want to delete this listing?</p>
                    <p className=''><i>Deleting a listing is permanent!</i></p>
                    <p className='flex-1 capitalize'><b>VIN</b> {ListingToDelete.replaceAll('_', ' ')}</p>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => { setShowModal(null) }} className=' p-4 rounded-full mx-auto bg-white border border-solid border-indigo-100 text-indigo-400  px-8 duration-200 hover:opacity-60'>Go back</button>
                        <button onClick={handleDeleteListing} className=' flex-1 p-4 text-pink-400 rounded-full mx-auto bg-white border border-solid border-pink-400 px-8 duration-200 hover:opacity-60'>Confirm Delete</button>
                        <Button text={'Upgrade Account'} clickHandler={() => { router.push('/admin/billing') }} />
                        {/* <Button text={'Upgrade Account ⭐️'} clickHandler={() => { router.push('/admin/billing') }} /> */}
                    </div>
                </div>
            </div>
        )
    }


    useEffect(() => {
        if (!nextFocusElement) {
            return
        }
        document.getElementById(nextFocusElement) && document.getElementById(nextFocusElement).focus()
        setNextFocusElement(null)
    }, [nextFocusElement])

    useEffect(() => {
        if (!userDataObj) { return }
        const { userData: localUserData, resumeSections: localResumeSections } = userDataObj
        localUserData && setUserData(localUserData)
        localResumeSections && setResumeSections(localResumeSections)
    }, [userDataObj])

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {modalContent[showModal]}
                </Modal>
            )}
            <div className='flex flex-col gap-8 flex-1'>
                 <ActionCard title={'Setup your enthusiastlist.app listing'}>
                    <div className='flex items-stretch gap-5 overflow-x-scroll '>
                        {completionSteps.map((step, stepIndex) => {
                            return (
                                <button onClick={() => {
                                    if (instruction === `${stepIndex}`) {
                                        setInstruction(null)
                                        return
                                    }
                                    setInstruction(`${stepIndex}`)
                                }} className={'flex items-center  duration-200 group gap-4 p-2 pr-4 rounded-full border border-solid  ' + (stepIndex == instruction ? ' border-indigo-400' : ' border-indigo-100 hover:border-indigo-400')} key={stepIndex}>
                                    <div className={'px-2 aspect-square rounded-full grid duration-200 place-items-center  text-white ' + (stepIndex == instruction ? ' bg-indigo-400' : ' bg-indigo-200 group-hover:bg-indigo-400')}>
                                        <i className={step[1]} />
                                    </div>
                                    <p className='whitespace-nowrap'>{step[0]}</p>
                                </button>
                            )
                        })}
                    </div>
                    {instruction && (<ul className='flex list-disc rounded-2xl border border-solid border-indigo-100 p-4 list-inside flex-col  '>
                        {completionSteps[instruction][2].split('. ').map((element, elementIndex) => {
                            return (
                                <li key={elementIndex} className='text-slate-600'>{element.replaceAll('.', '')}.</li>

                            )
                        })}
                    </ul>)}
                </ActionCard>
             
                <ActionCard title={'Listings'} actions={numberOfListings >= 20 ? null : (
                    <div className='flex items-center gap-4'>
                        {numberOfListings < 20 && (
                            <button onClick={handleCreateListing} className='flex items-center justify-center gap-4 border border-solid border-indigo-200 px-4 py-2 rounded-full text-xs sm:text-sm text-indigo-400 duration-200 hover:opacity-50'>
                                <p className=''>Create new</p>
                            </button>
                        )}
                    </div>
                )}>
                    <div className='flex flex-col gap-2 overflow-x-scroll'>
                        <div className='grid grid-cols-4 shrink-0'>
                            {['VIN', 'year', 'company', 'model', '', '', ''].map((label, labelIndex) => {
                                return (
                                    <div key={labelIndex} className='p-1 capitalize px-2 text-xs sm:text-sm font-medium'>
                                        <p className='truncate'>{label}</p>
                                    </div>
                                )
                            })}
                        </div>
                        {(Object.keys(userDataObj?.listings || {}) || []).map((ListingName, ListingIndex) => {
                            const Listing = userDataObj?.listings?.[ListingName] || {}
                            const { applicationMeta, carDescription, application } = Listing
                            return (
                                <div className='flex flex-col relative group ' key={ListingIndex}>
                                    <button onClick={() => {
                                        setListingToDelete(ListingName)
                                        setShowModal('deleteListing')
                                    }} className='flex items-center justify-center gap-4 rounded-full text-xs sm:text-sm text-pink-400 duration-200  absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 hover:text-pink-200'>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                    <Link href={'/admin/application?id=' + (applicationMeta?.id || ListingName)} className='grid shrink-0 capitalize grid-cols-4 border border-solid border-indigo-50 duration-200 hover:bg-indigo-50 rounded-lg overflow-hidden '>
                                        <div className='p-2'>
                                            <p className='truncate hover:text-indigo-400'>{applicationMeta?.id}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.year}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.company}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.model}</p>
                                        </div>
                               {/*         <div className='p-2'>
                                            <p className={'truncate ' + (application ? 'text-green-400' : 'text-pink-300')}>{application ? 'True' : 'False'}</p>
                                </div> */}
                                    </Link>
                                </div> 
                            )
                        })}
                    </div>
                </ActionCard>
              
                <div className='grid grid-cols-2 sm:w-fit gap-4'>
                    <button onClick={handleSaveResume} className='flex items-center justify-center gap-2 border border-solid border-white bg-white p-4 rounded-full  text-indigo-400 duration-200 hover:opacity-50'>
                        <p className=''>{savingResume ? 'Saving ...' : 'Save Listing'}</p>
                        <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                    <Link href={'/resume?user=' + currentUser.displayName} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-indigo-100 bg-white p-4 rounded-full text-indigo-400 duration-200 hover:opacity-50 '}>
                        <p className=''>PDF Viewer</p>
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </Link>
                </div>

            </div>
            <LogoFiller />
        </>
    )
}
