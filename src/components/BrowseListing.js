'use client'
import React, { useState, useEffect } from 'react'
import ActionCard from './ActionCard'
import Link from 'next/link'
import InputWrapper from './InputWrapper'
import { Open_Sans } from 'next/font/google'
import Button from './Button'
import LogoFiller from './LogoFiller'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from './Modal'


const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});

// coverLetters = {[letterId]: {...applicationMeta, jobPosting, application}}

export default function Application() {
    let defaultApplicationData = {
        company: '',
        model: '',
        year: '',
        status: '', // dropdown between preparation submitted followed up rejected approved
        id: ''
    }
    const [applicationMeta, setApplicationMeta] = useState(defaultApplicationData)
    const [application, setApplication] = useState('')
    const [jobPosting, setJobPosting] = useState('')
    const [changedData, setChangedData] = useState(false)
    const [savingData, setSavingData] = useState(false)
    const [applicationID, setApplicationID] = useState('')
    const [includeResume, setIncludeResume] = useState(true)
    const [isResponding, setIsResponding] = useState(false)
    const [showStatuses, setShowStatuses] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(null)

    
    const { userDataObj, currentUser, setUserDataObj, isPaid } = useAuth()
    let apiCalls = userDataObj?.billing?.apiCalls || 0

    const router = useRouter()
    const searchParams = useSearchParams()


    const placeHolders = {
        company: 'BMW', model: 'M3', year: '2018', status: 'clean'
    }

    function handleSubmitName() {
        if (!applicationID || applicationID.length < 6) { return }
        router.push('/admin/application?id=' + applicationID);
        // updateUserData('id', applicationID)
    }

    function updateUserData(type, val) {
        setApplicationMeta({ ...applicationMeta, [type]: val })
        setChangedData(true)
    }

    function handleCancelDetails() {
        let currData = localStorage.getItem('hyr')
        let localApplicationMeta
        if (currData) {
            localApplicationMeta = JSON.parse(currData).localApplicationMeta || defaultApplicationData
        } else {
            localApplicationMeta = defaultApplicationData
        }
        setApplicationMeta(localApplicationMeta)
        setChangedData(false)
    }

    async function handleSaveApplication() { // show modal and get the user to name the application
        if (savingData || isResponding) { return }
        setSavingData(true)
        let currData = localStorage.getItem('hyr')
        if (currData) {
            currData = JSON.parse(currData)
        } else {
            currData = {}
        }

        let newCoverLetter = {
            [applicationMeta.id]: {
                applicationMeta,
                jobPosting,
                application
            }
        }

        try {

            let newCoverLettersObj = {
                ...(currData.coverLetters || {}),
                ...newCoverLetter
            }
            let newData = { ...currData, coverLetters: newCoverLettersObj }
            localStorage.setItem('hyr', JSON.stringify(newData))
            setUserDataObj(curr => ({ ...curr, coverLetters: newCoverLettersObj }))
            const userRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(userRef, {
                coverLetters: {
                    ...newCoverLetter
                }
            }, { merge: true });
            console.log(res)
        } catch (err) {
            console.log('Failed to save data\n', err.message)
        } finally {
            setSavingData(false)
        }

    }

    async function generateCoverLetter(type, isConfirmed) {
        if (!isReady) { return }

        let requestString = `Can you please generate a cover letter for the following role (${applicationMeta.role}) at ${applicationMeta.company}. Here is the job posting:\n\n${jobPosting}\n\n `
        if (includeResume && userDataObj.resumeSections) {
            requestString = requestString += `Can you please also incorporate information from my resume and match it to the requirements of the job posting :\n\n${JSON.stringify(userDataObj.resumeSections)}`
        }

        if (type === 'copy') {
            copyToClipboard(requestString)
            return
        }


        if (isPaid) {
            AILetter(requestString)
            return
        }

        if (isConfirmed) {
            // increment count in billing and on local device
            const userRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(userRef, {
                billing: {
                    apiCalls: parseInt(apiCalls) + 1
                }
            }, { merge: true });
            setUserDataObj(curr => ({
                ...curr,
                billing: {
                    ...curr?.billing,
                    apiCalls: parseInt(apiCalls) + 1
                }
            }))
            AILetter(requestString)
            setShowModal(null)
            return
        }

        if (apiCalls < 3) {
            // open up the modal and let people know this is one of their free uses, ask to confirm and if they say yes, then go 
            setShowModal('confirmed')
            return
        }
        setShowModal('blocked')
        // if here, then limit it exceed and make them upgrade or use the copy version and link them to chatgpt
    }

    async function copyToClipboard(requestString) {
        setCopied(true)
        navigator.clipboard.writeText(requestString)
        await new Promise(r => setTimeout(r, 2000));
        setCopied(false)
    }

    async function AILetter(requestString) {
        if (isResponding) { return }
        setApplication('')
        setIsResponding(true)
        try {
            // fetch (stream letter)
            const options = {
                method: 'POST',
                header: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ prompt: requestString })
            }
            const res = await fetch('/api', options)
            if (!res.ok) {
                console.log('Response bad status')
                return
            }
            const streamToString = async (body) => {
                try {
                    const reader = body?.pipeThrough(new TextDecoderStream()).getReader()

                    while (reader) {
                        let stream = await reader.read()
                        if (stream.done) { break }
                        const chunks = stream.value
                        // .replaceAll(/^data: /gm, "")
                        // .split("\n")
                        // .filter((c) => Boolean(c.length) && c !== "[DONE]")
                        // .map((c) => {
                        //     console.log(c)
                        //     return c
                        //     // return JSON.parse(c)
                        // })
                        if (chunks) {
                            console.log(chunks)
                            for (let chunk of chunks) {
                                const content = chunk//.choices[0].delta.content
                                if (!content) { continue }
                                console.log(content)
                                setApplication(currMessage => {
                                    return currMessage + content
                                })
                            }
                        }
                    }
                    setIsResponding(false)
                } catch (err) {
                    console.log('Made an oopsies', err)
                    setApplication('No cover letter for you today sorry!')
                    setIsResponding(false)
                }
            }

            streamToString(res.body)

            // fill out section
        } catch (err) {
            console.log('Failed to generate letter', err.message)
        } finally {
            setIsResponding(false)
        }
    }

    const isReady = jobPosting && applicationMeta.company && applicationMeta.role

    useEffect(() => {
        if (!userDataObj || !searchParams) { return }
        const applicationName = searchParams.get('id')
        let coverLetters = userDataObj?.coverLetters || {}
        if (!applicationName) {
            return
        }
        setApplicationMeta(curr => ({ ...curr, id: applicationName }))
        if (!(applicationName in coverLetters)) { return }
        const coverLetter = coverLetters[applicationName]
        const { applicationMeta: localApplicationMeta, jobPosting: localJobPosting, application: localApplication } = coverLetter
        localApplicationMeta && setApplicationMeta(localApplicationMeta)
        localJobPosting && setJobPosting(localJobPosting)
        localApplication && setApplication(localApplication)
    }, [userDataObj, searchParams])

    // if it doesn't exist, then prompt the user to create a new one

    function sortDetails(arr) {
        const order = ['company', 'model', 'year', 'status']
        return [...arr].sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b)
        })
    }

    if (!applicationMeta.id) {
        return (
            <>
                <ActionCard title={'New listing'} lgHeader noFlex>
                    <p className='  '>Give cover letter for your job application a name!</p>
                    <p className='font-medium'>Name</p>
                    <div className='flex flex-col gap-1'>
                        <p className='opacity-40 text-xs sm:text-sm italic'>• This name cannot be changed.</p>
                        <p className='opacity-40 text-xs sm:text-sm italic'>• Name must be at least 6 characters.</p>
                    </div>
                    <input value={applicationID} onChange={(e) => { setApplicationID(e.target.value) }} className=' bg-white border rounded-lg border-solid border-blue-100 w-full outline-none p-2 ' placeholder='Enter a unique name' />
                    <div className='flex items-stretch justify-between gap-4 '>
                        <Link href={'/admin'} className='flex items-center mr-auto justify-center gap-4 bg-white border border-solid border-blue-100  px-4 py-2 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                            <p className=''>&larr; Back</p>
                        </Link>
                        <button onClick={handleSubmitName} className='flex items-center justify-center gap-2 border border-solid border-white bg-blue-50 px-3 py-2 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                            <p className=''>Create</p>
                            <i className="fa-regular fa-circle-check"></i>
                        </button>
                    </div>
                </ActionCard>
                <LogoFiller />
            </>
        )
    }

    const modalContent = {
        confirmed: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>Free cover letter generation!</p>
                <p>You have <b>{3 - apiCalls}</b> free cover letter generations remaining.</p>
                <p className=''><i>Be sure you have completed your resume and confirmed the details of your application prior to generating the cover letter.</i></p>
                <p className='flex-1'>Upgrading your account allows <b>unlimited</b> cover letter generations! <br />
                    <Link className='blueGradient' href={'/admin/billing'}>Upgrade here &rarr;</Link></p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className=' w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 px-8 duration-200 hover:opacity-70'>Go back</button>
                    <Button text={'Confirm generation'} clickHandler={() => { generateCoverLetter('ai', true) }} />
                </div>
            </div>
        ),
        blocked: (
            <div className='flex flex-1 flex-col gap-4'>
                <p className='font-medium text-lg sm:text-xl md:text-2xl'>You&apos;ve used up your free generations!    </p>
                <p>Please upgrade your account to continue using this feature.</p>
                <p className=''><i>You can also use the Copy Prompt feature to generate a cover letter via your own ChatGPT instance.</i></p>
                <p className='flex-1'>Upgrading your account also allows you to create and manage numerous additional cover letters! </p>
                <div className='flex items-center gap-4'>
                    <button onClick={() => { setShowModal(null) }} className=' w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 px-8 duration-200 hover:opacity-60'>Go back</button>
                    <Button text={'Upgrade account ⭐️'} clickHandler={() => { router.push('/admin/billing') }} />
                </div>
            </div>
        )
    }

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {modalContent[showModal]}
                </Modal>
            )}

            {showModal && (
                <Modal handleCloseModal={() => { setShowModal(null) }}>
                    {modalContent[showModal]}
                </Modal>
            )}        <div className='flex flex-col gap-8 flex-1'>
                <div className='flex items-center justify-between gap-4'>

                    <Link href={'/admin'} className='flex items-center mr-auto justify-center gap-4 bg-white  px-4 py-2 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                        <p className=''>&larr; Back</p>
                    </Link>
                    <button onClick={handleSaveApplication} className='flex items-center justify-center gap-2 border border-solid border-white bg-blue-50 px-3 py-2 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                        <p className=''>{savingData ? 'Saving' : 'Save'}</p>
                        <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                </div>
                <ActionCard title={'Car Listing Details'} subTitle={applicationMeta.id} >
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
                        {sortDetails(Object.keys(applicationMeta)).filter(val => val !== 'id').map((entry, entryIndex) => {
                            return (
                                <div className='flex items-center gap-4' key={entryIndex}>
                                    <p className=' capitalize font-medium w-24 sm:w-32'>{entry}{['company', 'role'].includes(entry) ? '' : ''}</p>
                                    {entry === 'status' ? (
                                        <div className='flex flex-col gap-1 w-full  relative   '>
                                            <button onClick={() => {
                                                setShowStatuses(!showStatuses)
                                            }} className={'flex items-center gap-4 justify-between p-2 border border-solid border-slate-100 rounded-t-lg  ' + (showStatuses ? ' ' : '  rounded-b-lg')}>
                                                <p className='capitalize'>{applicationMeta.status || 'Select status'}</p>
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </button>
                                            {showStatuses && (
                                                <div className='flex flex-col border-l rounded-b-lg border-b border-r border-solid border-slate-100 bg-white z-[10] absolute top-full left-0 w-full'>
                                                    {['clean', 'rebuilt', 'salvage', 'lemon', 'other',].map((stat, statIndex) => {
                                                        return (
                                                            <button onClick={() => {
                                                                updateUserData('status', stat)
                                                                setShowStatuses(false)
                                                            }} className='p-2 capitalize' key={statIndex}>
                                                                <p className={'duration-200 ' + (stat === applicationMeta.status ? ' font-medium' : ' ')}>{stat}</p>
                                                            </button>
                                                        )
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
                            )
                        })}
                    </div>
                    <div className='flex flex flex-col sm:items-center sm:flex-row gap-4'>
                        <p className=' capitalize font-medium '>Include Pictures</p>
                        <div className='grid grid-cols-2 gap-4'>
                            {[true, false].map((val, valIndex) => {
                                return (
                                    <button onClick={() => { setIncludeResume(val) }} key={valIndex} className={'flex items-center gap-2 group'}>
                                        <div className={'h-4 aspect-square rounded border border-slate-600 duration-200 border-solid ' + ((val === includeResume) ? ' bg-slate-600' : ' group-hover:bg-slate-600')} />
                                        <p className={'duration-200 whitespace-nowrap ' + ((val === includeResume) ? ' ' : ' text-slate-500')}>{val ? 'Yes (recommended)' : "No"}</p>
                                    </button>
                                )
                            })}
                        </div>
                        {/* <div className='flex flex-col border border-solid border-slate-100 flex-1 rounded-xl'>
                        <button className='p-2 flex items-center justify-between'>
                            <p>Select</p>
                            <i className="fa-solid fa-chevron-down"></i>
                        </button>
                    </div> */}

                    </div>

                </ActionCard>
                <ActionCard title={'Description'} >
                    <InputWrapper minHeight={'200px'} value={jobPosting}>
                        <textarea value={jobPosting} placeholder='Paste the listing description here ...' onChange={(e) => {
                            setJobPosting(e.target.value)
                        }} className='unstyled h-full resize-none absolute inset-0 '></textarea>
                    </InputWrapper>

                </ActionCard>
            
                {application && (
                    <div className='grid grid-cols-2 gap-4 sm:w-fit'>
                        <button onClick={handleSaveApplication} className='flex items-center  justify-center gap-2 border border-solid border-white bg-white p-4 rounded-full  text-blue-400 duration-200 hover:opacity-50'>
                            <p className=''>{savingData ? 'Saving' : 'Save'}</p>
                            <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                        <Link href={'/coverletter/' + applicationMeta.id} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-blue-100 bg-white p-4 rounded-full text-blue-400 duration-200 hover:opacity-50 ' + (!isReady ? ' opacity-50' : ' ')}>
                            <p className=''>PDF Viewer</p>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}