'use client'
import { useAuth } from '@/context/AuthContext';
import { Poppins, Open_Sans } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import GraphicDisplay from './GraphicDisplay';
import Bio from './Layouts/Bio';
import Education from './Layouts/Education';
import WorkExperience from './Layouts/WorkExperience';
import Skills from './Layouts/Skills';
import Projects from './Layouts/Projects';
import SectionWrapper from './Layouts/SectionWrapper';
import Login from './Login';
import { deleteField, doc, setDoc } from 'firebase/firestore';
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
    ['Complete your listing', 'fa-solid fa-pen-to-square', 'Fill out your resume in the display below by adding all the sections you feel relevant to your experience; remember to keep your resume to approximately 1 page in length. You can view your resume by selecting the PDF Viewer button beneath, and can print the web page to a PDF that you can save to your local device. Be sure to adjust the print scale to get the perfect PDF fit.'],
    ['Upload pictures', 'fa-solid fa-scroll', 'Once you have completed your resume, create a new listing, completing all the details relevant to the application. Once you have added in the details in addition to pasting in the application, you can generate your perfect listing and make any final adjustments you feel necessary.'],
    ['Share your link', 'fa-solid fa-share', 'With your resume complete and saved, you can choose to publish your resume and have a live version at your special link. You can share this link with anyone!']
]

const sectionTemplates = {
    bio: '',
    education: {
        instituion: '',
        qualification: '',
        startDate: '',
        endDate: '',
        location: '',
        notes: ['']
    },
    work_experience: [
        {
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            location: '',
            notes: [''],
            tools: ['']
        }
    ],
    skills: [{ genre: '', list: '' }],
    projects: [
        {
            name: '',
            link: '',
            startDate: '',
            endDate: '',
            location: '',
            notes: [''],
            tools: ['']
        }
    ]   
}

export default function Dashboard() {

    const [completedSteps, setCompletedSteps] = useState([])
    let defaultUserData = { name: '', email: '', website: '', location: '' }
    const [userData, setUserData] = useState(defaultUserData)
    const [changedData, setChangedData] = useState(false)
    const [resumeSections, setResumeSections] = useState([])
    const [addSection, setAddSection] = useState(false)
    const [showModal, setShowModal] = useState(null)
    const [coverletterToDelete, setCoverletterToDelete] = useState('')
    const [instruction, setInstruction] = useState(null)
    const [savingUserDetails, setSavingUserDetails] = useState(false)
    const [savingResume, setSavingResume] = useState(false)
    const [publishingResume, setPublishingResume] = useState(false) // show in modal
    const [nextFocusElement, setNextFocusElement] = useState(null)

    const router = useRouter()

    const { currentUser, loading, userDataObj, setUserDataObj, isPaid } = useAuth()
    let numberOfListings = Object.keys(userDataObj?.listings || {}).length

    const placeHolders = {
        name: 'John Doe', email: 'johndoe@gmail.com', website: 'www.johndoe.com', location: 'City, Country'
    }

    function updateUserData(type, val) {
        setUserData({ ...userData, [type]: val })
        setChangedData(true)
    }

    async function handleSaveDetails() {
        if (savingUserDetails) { return }
        let currData = localStorage.getItem('hyr')
        if (currData) {
            currData = JSON.parse(currData)
        } else {
            currData = {}
        }
        try {
            setSavingUserDetails(true)
            let newData = { ...currData, userData }
            localStorage.setItem('hyr', JSON.stringify(newData))
            setChangedData(false)
            const userRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(userRef, { userData }, { merge: true });
            console.log(res)
        } catch (err) {
            console.log('Failed to save data\n', err.message)
        } finally {
            setSavingUserDetails(false)
        }
    }

    function handleCancelDetails() {
        let currData = localStorage.getItem('hyr')
        let currUserData
        if (currData) {
            currUserData = JSON.parse(currData).userData || defaultUserData
        } else {
            currUserData = defaultUserData
        }
        setUserData(currUserData)
        setChangedData(false)
    }

    function moveSection(section, increment) {
        let listOfSections = Object.keys(resumeSections)
        let currIndex = listOfSections.indexOf(section)
        if ((currIndex + increment) < 0 || (currIndex + increment) > listOfSections.length - 1) {
            return
        }
        //swap list items

        let temp = listOfSections[currIndex + increment]
        listOfSections[currIndex + increment] = listOfSections[currIndex]
        listOfSections[currIndex] = temp

        //rebuild resume data from new ordered list
        let newObj = {}
        listOfSections.forEach(subSection => {
            newObj[subSection] = resumeSections[subSection]
        })
        setResumeSections(newObj)
    }

    function handleDeleteSection(s) {
        // deletes the entire section
        let newObj = { ...resumeSections }
        delete newObj[s]
        setResumeSections(newObj)
    }


    // BIO CRUD FUNCTIONS

    function handleUpdateBio(newVal) {
        setResumeSections({ ...resumeSections, bio: newVal })
    }


    // WORK EXPERIENCE CRUD FUNCTIONS

    function handleUpdateWork(index, key, newVal, newValIndex, newLine) {
        let newInfo
        if (['notes', 'tools'].includes(key)) {
            newInfo = [...resumeSections.work_experience[index][key]]
            newInfo[newValIndex] = newVal
            if (newLine) {
                newInfo = [...newInfo.slice(0, newValIndex + 1), '', ...newInfo.slice(newValIndex + 1)]
            }
        } else {
            newInfo = newVal
        }
        let newObj = { ...resumeSections.work_experience[index], [key]: newInfo }
        let newArray = [...resumeSections.work_experience]
        newArray[index] = newObj
        setResumeSections(curr => {
            return { ...resumeSections, work_experience: newArray }
        })

        if (newLine) {
            setNextFocusElement(newLine)
        }
    }

    function handleAddWork() {
        let newWork = [...resumeSections.work_experience, {
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            location: '',
            notes: [''],
            tools: ['']
        }]
        setResumeSections({ ...resumeSections, work_experience: newWork })
    }
    function handlAddWorkListItem(index, key, newVal) {
        let newInfo
        if (!['notes', 'tools'].includes(key)) {
            return
        }
        newInfo = [...resumeSections.work_experience[index][key], '']
        let newObj = { ...resumeSections.work_experience[index], [key]: newInfo }
        let newArray = [...resumeSections.work_experience]
        newArray[index] = newObj
        setResumeSections({ ...resumeSections, work_experience: newArray })
    }

    function handleDeleteWorkSection(index) {
        // deletes a work experience item
        let newWorkExperienceList = resumeSections.work_experience.filter((val, valIndex) => {
            return valIndex !== index
        })
        setResumeSections(curr => ({ ...curr, work_experience: newWorkExperienceList }))
    }


    function deleteWorkListItem(workIndex, itemIndex) {
        // deletes a description item
        let newWorkExperienceList = resumeSections.work_experience
        let newNotesList = newWorkExperienceList[workIndex].notes.filter((val, valIndex) => {
            return itemIndex !== valIndex
        })
        newWorkExperienceList[workIndex].notes = newNotesList
        setResumeSections({ ...resumeSections, work_experience: newWorkExperienceList })
    }


    // PROJECT CRUD FUNCTIONS

    function handleUpdateProject(index, key, newVal, newValIndex, newLine) {
        let newInfo
        if (['notes', 'tools'].includes(key)) {
            newInfo = [...resumeSections.projects[index][key]]
            newInfo[newValIndex] = newVal
            if (newLine) {
                newInfo = [...newInfo.slice(0, newValIndex + 1), '', ...newInfo.slice(newValIndex + 1)]
            }
        } else {
            newInfo = newVal
        }
        let newObj = { ...resumeSections.projects[index], [key]: newInfo }
        let newArray = [...resumeSections.projects]
        newArray[index] = newObj
        setResumeSections({ ...resumeSections, projects: newArray })
        if (newLine) {
            setNextFocusElement(newLine)
        }
    }

    function handleAddProject() {
        let newWork = [...resumeSections.projects, {
            name: '',
            link: '',
            startDate: '',
            endDate: '',
            location: '',
            notes: [''],
            tools: ['']
        }]
        setResumeSections({ ...resumeSections, projects: newWork })
    }

    function handlAddProjectListItem(index, key, newVal) {
        let newInfo
        if (!['notes', 'tools'].includes(key)) {
            return
        }
        newInfo = [...resumeSections.projects[index][key], '']
        let newObj = { ...resumeSections.projects[index], [key]: newInfo }
        let newArray = [...resumeSections.projects]
        newArray[index] = newObj
        setResumeSections({ ...resumeSections, projects: newArray })
    }

    function handleDeleteProjectSection(index) {
        // deletes a work experience item
        let newWorkExperienceList = resumeSections.projects.filter((val, valIndex) => {
            return valIndex !== index
        })
        setResumeSections(curr => ({ ...curr, projects: newWorkExperienceList }))
    }


    function deleteProjectListItem(workIndex, itemIndex) {
        // deletes a description item
        let newWorkExperienceList = resumeSections.projects
        let newNotesList = newWorkExperienceList[workIndex].notes.filter((val, valIndex) => {
            return itemIndex !== valIndex
        })
        newWorkExperienceList[workIndex].notes = newNotesList
        setResumeSections({ ...resumeSections, projects: newWorkExperienceList })
    }

    // EDUCATION CRUD FUNCTIONS


    function handleUpdateEducation(key, newVal, newValIndex, newLine) {
        let newInfo
        if (['notes', 'tools'].includes(key)) {
            newInfo = [...resumeSections.education[key]]
            newInfo[newValIndex] = newVal
            console.log(newInfo.slice(newValIndex + 1))
            if (newLine) {
                newInfo = [...newInfo.slice(0, newValIndex + 1), '', ...newInfo.slice(newValIndex + 1)]
            }
        } else {
            newInfo = newVal
        }
        let newObj = { ...resumeSections.education, [key]: newInfo }
        setResumeSections(curr => {
            return { ...resumeSections, education: newObj }
        })
        if (newLine) {
            setNextFocusElement(newLine)
        }

    }

    function handlAddEducationListItem(key, newVal) {
        let newInfo
        if (!['notes', 'tools'].includes(key)) {
            return
        }
        newInfo = [...resumeSections.education[key], '']
        let newObj = { ...resumeSections.education, [key]: newInfo }
        setResumeSections({ ...resumeSections, education: newObj })
    }

    function deleteEducationListItem(itemIndex) {
        // deletes a description item
        let newWorkExperienceList = resumeSections.education
        let newNotesList = newWorkExperienceList.notes.filter((val, valIndex) => {
            return itemIndex !== valIndex
        })
        newWorkExperienceList.notes = newNotesList
        setResumeSections({ ...resumeSections, education: newWorkExperienceList })
    }

    // SKILLS CRUD FUNCTIONS


    function handleUpdateSkills(index, value) {
        let newObj = { ...resumeSections.skills[index], list: value }
        let newBigArr = [...resumeSections.skills]
        newBigArr[index] = newObj
        setResumeSections({ ...resumeSections, skills: newBigArr })
    }

    function handleUpdateGenre(index, genre) {
        let newObj = { ...resumeSections.skills[index], genre }
        let newBigArr = [...resumeSections.skills]
        newBigArr[index] = newObj
        setResumeSections({ ...resumeSections, skills: newBigArr })
    }

    function handleAddSkillset() {
        let newBigArr = [...resumeSections.skills, { genre: '', list: '' }]
        setResumeSections({ ...resumeSections, skills: newBigArr })
    }

    function deleteSkillsRow(index) {
        let newBigArr = resumeSections.skills.filter((val, valIndex) => { return valIndex !== index })
        setResumeSections({ ...resumeSections, skills: newBigArr })
    }


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

        if (numberOfListings >= 3) {
            // prompt to upgrade account
            setShowModal('listings')
            return
        }
        router.push('/admin/application')
    }

    async function handleDeleteCoverLetter() {
        if (!coverletterToDelete || !(coverletterToDelete in userDataObj.listings)) { return }
        let newCoverlettersObj = { ...userDataObj.listings }
        delete newCoverlettersObj[coverletterToDelete]
        try {
            // write to fire base
            const userRef = doc(db, 'users', currentUser.uid);
            const res = await setDoc(userRef, {
                listings: {
                    [coverletterToDelete]: deleteField()
                }
            }, { merge: true });
            let newDataObj = { ...userData, listings: newCoverlettersObj }

            // update local userdata and set to local storage
            setUserDataObj(newDataObj)
            localStorage.setItem('hyr', JSON.stringify(newDataObj))
        } catch (err) {
            console.log('Failed to delete listing', err.message)
        } finally {
            setShowModal(null)
            setCoverletterToDelete('')
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
                    <button onClick={() => { setShowModal(null) }} className=' w-fit p-4 rounded-full mx-auto bg-white border border-solid border-blue    -100 px-8 duration-200 hover:opacity-60'>Go back</button>
                    <Button text={'Upgrade Account'} clickHandler={() => { router.push('/admin/billing') }} />
                </div>
            </div>
        ),
        publishing: (
            <div></div>
        ),
        deleteCoverletter: (
            <div>
                <div className='flex flex-1 flex-col gap-4'>
                    <p className='font-medium text-lg sm:text-xl md:text-2xl'>Are you sure you want to delete this listing?</p>
                    <p className=''><i>Deleting a listing is permanent!</i></p>
                    <p className='flex-1 capitalize'><b>VIN</b> {coverletterToDelete.replaceAll('_', ' ')}</p>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => { setShowModal(null) }} className=' p-4 rounded-full mx-auto bg-white border border-solid border-blue-100 text-blue-400  px-8 duration-200 hover:opacity-60'>Go back</button>
                        <button onClick={handleDeleteCoverLetter} className=' flex-1 p-4 text-pink-400 rounded-full mx-auto bg-white border border-solid border-pink-400 px-8 duration-200 hover:opacity-60'>Confirm Delete</button>
                        <Button text={'Upgrade Account'} clickHandler={() => { router.push('/admin/billing') }} />
                        {/* <Button text={'Upgrade Account ⭐️'} clickHandler={() => { router.push('/admin/billing') }} /> */}
                    </div>
                </div>
            </div>
        )
    }

    const sections = {
        bio: <Bio val={resumeSections.bio} setVal={handleUpdateBio} handleDeleteSection={handleDeleteSection} />,
        education: <Education deleteEducationListItem={deleteEducationListItem} resumeSections={resumeSections} handleUpdateWork={handleUpdateEducation} handlAddWorkListItem={handlAddEducationListItem} />,
        work_experience: <WorkExperience deleteWorkListItem={deleteWorkListItem} handleDeleteWorkSection={handleDeleteWorkSection} resumeSections={resumeSections} handleUpdateWork={handleUpdateWork} handleAddWork={handleAddWork} handlAddWorkListItem={handlAddWorkListItem} />,
        skills: <Skills deleteSkillsRow={deleteSkillsRow} handleAddWork={handleAddSkillset} resumeSections={resumeSections} handleUpdateSkills={handleUpdateSkills} handleUpdateGenre={handleUpdateGenre} />,
        projects: <Projects handleDeleteProjectSection={handleDeleteProjectSection}
            deleteProjectListItem={deleteProjectListItem} resumeSections={resumeSections} handleUpdateWork={handleUpdateProject} handleAddWork={handleAddProject} handlAddWorkListItem={handlAddProjectListItem} />
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
                 <ActionCard title={'Setup your enthusiastlist.app page'}>
                    <div className='flex items-stretch overflow-x-scroll gap-5'>
                        {completionSteps.map((step, stepIndex) => {
                            return (
                                <button onClick={() => {
                                    if (instruction === `${stepIndex}`) {
                                        setInstruction(null)
                                        return
                                    }
                                    setInstruction(`${stepIndex}`)
                                }} className={'flex items-center  duration-200 group gap-4 p-2 pr-4 rounded-full border border-solid  ' + (stepIndex == instruction ? ' border-blue-400' : ' border-blue-100 hover:border-blue-400')} key={stepIndex}>
                                    <div className={'px-2 aspect-square rounded-full grid duration-200 place-items-center  text-white ' + (stepIndex == instruction ? ' bg-blue-400' : ' bg-blue-200 group-hover:bg-blue-400')}>
                                        <i className={step[1]} />
                                    </div>
                                    <p className='whitespace-nowrap'>{step[0]}</p>
                                </button>
                            )
                        })}
                    </div>
                    {instruction && (<ul className='flex list-disc rounded-2xl border border-solid border-blue-100 p-4 list-inside flex-col  '>
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
                            <button onClick={handleCreateListing} className='flex items-center justify-center gap-4 border border-solid border-blue-100  px-4 py-2 rounded-full text-xs sm:text-sm text-blue-400 duration-200 hover:opacity-50'>
                                <p className=''>Create new</p>
                            </button>
                        )}
                    </div>
                )}>
                    <div className='flex flex-col gap-2 overflow-x-scroll'>
                        <div className='grid grid-cols-4 shrink-0'>
                            {['VIN', 'company', 'model', 'live', '', '', ''].map((label, labelIndex) => {
                                return (
                                    <div key={labelIndex} className='p-1 capitalize px-2 text-xs sm:text-sm font-medium'>
                                        <p className='truncate'>{label}</p>
                                    </div>
                                )
                            })}
                        </div>
                        {(Object.keys(userDataObj?.listings || {}) || []).map((coverLetterName, coverLetterIndex) => {
                            const coverLetter = userDataObj?.listings?.[coverLetterName] || {}
                            const { applicationMeta, carDescription, application } = coverLetter
                            return (
                                <div className='flex flex-col relative group ' key={coverLetterIndex}>
                                    <button onClick={() => {
                                        setCoverletterToDelete(coverLetterName)
                                        setShowModal('deleteCoverletter')
                                    }} className='flex items-center justify-center gap-4 rounded-full text-xs sm:text-sm text-pink-400 duration-200  absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 hover:text-pink-200'>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                    <Link href={'/admin/application?id=' + (applicationMeta?.id || coverLetterName)} className='grid shrink-0 capitalize grid-cols-4 border border-solid border-blue-50 duration-200 hover:bg-blue-50 rounded-lg overflow-hidden '>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.id}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.company}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className='truncate'>{applicationMeta?.model}</p>
                                        </div>
                                        <div className='p-2'>
                                            <p className={'truncate ' + (application ? 'text-green-400' : 'text-pink-300')}>{application ? 'True' : 'False'}</p>
                                        </div>
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
                    <Link href={'/resume?user=' + currentUser.displayName} target='_blank' className={'flex items-center justify-center gap-2 border border-solid border-blue-100 bg-white p-4 rounded-full text-indigo-400 duration-200 hover:opacity-50 '}>
                        <p className=''>PDF Viewer</p>
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </Link>
                </div>

            </div>
            <LogoFiller />
        </>
    )
}
