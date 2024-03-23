import React from 'react'
import ReactDom from 'react-dom'

export default function Modal(props) {
    const { handleCloseModal, children } = props

    return ReactDom.createPortal(
        <div className='fixed top-0 left-0 h-screen w-screen z-[1000] flex flex-col justify-center items-center'>
            <div onClick={handleCloseModal} className='absolute inset-0 z-[-1] bg-slate-900 opacity-30'></div>
            <div className='flex flex-col justify-center w-fit mx-auto p-4 max-h-[70%]'>
                <div className='p-4 sm:p-8 rounded-lg bg-white max-w-[600px] w-full mx-auto  flex flex-col  dropShadow overflow-scroll'>
                    {children}
                </div>
            </div>
        </div >,
        document.getElementById('portal')
    )

}
