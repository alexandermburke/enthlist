import React from 'react'

export default function SectionWrapper(props) {
    const { children, title, resumeSectionIndex, moveSection, handleDeleteSection, viewer } = props
    return (
        <div className='flex flex-col gap-4 relative group/section' key={resumeSectionIndex} >
            <div className='flex items-center justify-between gap-4'>
                <h3 className={'text-lg sm:text-xl md:text-2xl capitalize '}>{title.replaceAll('_', ' ')}</h3>
                {!viewer && (
                    <div className='flex items-center bg-blue-100 rounded-full opacity-0 text-white duration-200 overflow-hidden group-hover/section:opacity-100'>
                        {/* <button onClick={() => {
                            moveSection(title, -1)
                        }} className=' duration-200 px-3 py-1 hover:bg-blue-200  '>
                            <i className="fa-solid fa-chevron-up"></i>
                        </button>
                        <button onClick={() => {
                            moveSection(title, 1)
                        }} className=' duration-200 px-3  py-1 hover:bg-blue-200'>
                            <i className="fa-solid fa-chevron-down"></i>
                        </button> */}
                        <button onClick={() => { handleDeleteSection(title) }} className=' duration-200 px-2 py-1 hover:bg-blue-200 '>
                            <i className="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                )}
            </div>
            {children}
        </div>
    )
}
