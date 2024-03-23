import React from 'react'
import InputWrapper from '../InputWrapper'


// {
//     instituion: '',
//     qualification: '',
//     startDate: '',
//     endDate: '',
//     location: '',
//     notes: ['']
// }


export default function Skills(props) {
    const { resumeSections, handleUpdateSkills, handleUpdateGenre, handleAddWork, viewer, deleteSkillsRow } = props
    const experience = resumeSections.skills

    if (viewer) {
        return (
            <div className='flex flex-col gap-1  relative'>
                {experience.map((note, noteIndex) => {
                    return (
                        <div key={noteIndex} className='flex items-center group/workItem gap-4 relative'>
                            <p className='w-[140px]'>{note.genre}</p>
                            <p className='font-light'>{note.list}</p>
                        </div>
                    )
                })}
            </div>
        )
    }


    return (
        <>
            <div className='flex flex-col gap-1  relative'>
                {experience.map((note, noteIndex) => {
                    return (
                        <div key={noteIndex} className='flex items-center group/workItem gap-4 relative'>
                            <button onClick={() => deleteSkillsRow(noteIndex)} className={'absolute opacity-0  duration-200  px-2 rounded-full aspect-square text-white hover:bg-blue-200 bg-blue-100 right-0 top-0 z-[14] ' + ` group-hover/workItem:opacity-100`}>
                                <i className="fa-regular fa-trash-can"></i>
                            </button>
                            <input value={note.genre} onChange={(e) => {
                                handleUpdateGenre(noteIndex, e.target.value)
                            }} placeholder='Productivity' className='unstyled max-w-[140px]  ' />
                            <input value={note.list} onChange={(e) => { handleUpdateSkills(noteIndex, e.target.value) }} className='unstyled font-light text-left ' placeholder='Excel, Markdown, VSCode ...' />
                        </div>
                    )
                })}
            </div>
            <button onClick={handleAddWork} className='flex items-center mr-auto justify-center gap-4 border border-solid border-blue-100  px-4 py-2 rounded-full text-xs sm:text-sm text-blue-400 duration-200 hover:opacity-50'>
                <p className=''>Add skillset</p>
            </button>
        </>

    )
}
