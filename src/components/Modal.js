import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, closeModal, imageSrc }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className='fixed top-0 left-0 h-screen w-screen z-[1000] flex justify-center items-center'>
            <div onClick={closeModal} className='absolute inset-0 z-0 bg-slate-900 opacity-90'></div>
            <div className='relative flex justify-center items-center w-full h-full'>
                <img src={imageSrc} alt="Enlarged" className="max-h-full max-w-full object-cover" />
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 text-white bg-red-500 rounded-full"
                >
                    &times;
                </button>
            </div>
        </div>,
        document.getElementById('portal')
    );
}
