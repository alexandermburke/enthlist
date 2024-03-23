import React from 'react'

export default function Button(props) {
    const { clickHandler, text, sm, icon, saving } = props
    return (
        <button onClick={clickHandler} className='flex-1 bg-white rounded-full max-w-[600px] mx-auto w-full outline-none border-none p-0.5 blueBackground overflow-hidden'>
            <div className={'w-full flex items-center justify-center gap-2  w-full   bg-white text-slate-800 rounded-full duration-200 hover:bg-transparent hover:text-white ' + (sm ? ' h-full text-xs sm:text-sm px-2' : ' p-4')}>
                {icon}
                <p className={'text-center '}>{saving || text}</p>
            </div>
        </button>
    )
}
