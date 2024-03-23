import React from 'react'

export default function Bio(props) {
    const { val, setVal, handleDeleteSection, viewer } = props

    if (viewer) {
        return (
            <div className='relative group/bio '>
                <p className=''>{val}</p>
            </div>
        )
    }

    return (
        <>
            <div className='relative group/bio '>
                <button onClick={() => { handleDeleteSection('bio') }} className={'absolute opacity-0  duration-200  px-2 rounded-full aspect-square text-white hover:bg-blue-200 bg-blue-100 right-0 top-0 z-[14] ' + ` group-hover/bio:opacity-100`}>
                    <i className="fa-regular fa-trash-can"></i>
                </button>
                <div className='flex flex-col opacity-0 select-none'>
                    {val.split('\n').map((s, sIndex) => {
                        return (
                            <p key={sIndex} className=''>{s || 'hi'}</p>
                        )
                    })}
                </div>
                <textarea className='unstyled w-full z-10 bg-green-400 resize-none absolute inset-0' placeholder='Enter a short paragraph (1-2 lines) about yourself.' value={val} onChange={(e) => { setVal(e.target.value) }} />
            </div>
        </>
    )
}
