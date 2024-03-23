import React, { useEffect } from 'react'
import InputWrapper from '../InputWrapper'


// {
//     instituion: '',
//     qualification: '',
//     startDate: '',
//     endDate: '',
//     location: '',
//     notes: ['']
// }


export default function Education(props) {
    const { resumeSections, handleUpdateWork, handleAddWork, handlAddWorkListItem, viewer, deleteEducationListItem } = props
    const experience = resumeSections.education


    if (viewer) {
        return (
            <>
                <div className='flex flex-col gap-1 group/workItem relative'>
                    <div className='flex items-center justify-between  gap-4'>
                        <p className='unstyled grow text-base  sm:text-lg'  >{experience.institution}</p>
                        <p className='unstyled min-w-[80px] text-right'  >{experience.endDate}</p>
                    </div>
                    <div className='flex items-center  gap-4'>
                        <p className='unstyled w-full italic ' >{experience.qualification}</p>
                        <p className='unstyled text-right italic ' >{experience.location}</p>
                    </div>
                    {experience.notes.map((note, noteIndex) => {
                        return (
                            <div key={noteIndex} className='flex gap-2 font-light relative group/workItemList'>
                                <p>•</p>
                                <p>{note}</p>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }


    return (
        <>
            <div className='flex flex-col gap-1 group/workItem relative'>
                <div className='flex items-center  gap-4'>
                    <input value={experience.institution} className='unstyled grow text-base  sm:text-lg' placeholder='Institution Name' onChange={(e) => { handleUpdateWork('institution', e.target.value) }} />
                    <input value={experience.endDate} onChange={(e) => { handleUpdateWork('endDate', e.target.value) }} className='unstyled min-w-[80px] text-right' placeholder='Sept 2023 - Present' />
                </div>
                <div className='flex items-center  gap-4'>
                    <input value={experience.qualification} onChange={(e) => { handleUpdateWork('qualification', e.target.value) }} className='unstyled w-full italic ' placeholder='Qualification' />
                    <input value={experience.location} onChange={(e) => { handleUpdateWork('location', e.target.value) }} className='unstyled text-right italic ' placeholder='City, Country' />
                </div>
                {experience.notes.map((note, noteIndex) => {
                    return (
                        <div key={noteIndex} className='flex gap-2 font-light relative group/workItemList'>
                            <button onClick={() => deleteEducationListItem(noteIndex)} className={'absolute opacity-0  duration-200  px-2 rounded-full aspect-square text-white hover:bg-blue-200 bg-blue-100 right-0 top-0 z-[14] ' + ` group-hover/workItemList:opacity-100`}>
                                <i className="fa-regular fa-trash-can"></i>
                            </button>
                            {/* <button className='absolute opacity-0 group-hover/workItemList:opacity-100 duration-200  px-2 rounded-full aspect-square text-white hover:bg-blue-200 bg-blue-100 right-0 top-0 z-[14]'>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button> */}
                            <p>•</p>
                            <InputWrapper value={note} multiLine>
                                <textarea id={`education_${noteIndex}`} value={note} onChange={(e) => {
                                    let newVal = e.target.value
                                    let newLined = newVal.endsWith('\n')
                                    let newLineIndex = newLined && `education_${noteIndex + 1}`
                                    console.log('NEW VALUE: ', e.target.value.replaceAll('\n', ''), newLineIndex)
                                    handleUpdateWork('notes', e.target.value.replaceAll('\n', ''), noteIndex, newLineIndex)
                                }} placeholder='Enter a description of your qualification' className='w-full resize-none absolute inset-0 unstyled'></textarea>
                            </InputWrapper>
                        </div>
                    )
                })}
            </div>
        </>

    )
}
