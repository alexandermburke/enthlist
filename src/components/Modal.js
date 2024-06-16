import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, closeModal, imageSrc, handlePrevClick, handleNextClick }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className='fixed top-0 left-0 h-screen w-screen z-[1000] flex justify-center items-center'>
            <div onClick={closeModal} className='absolute inset-0 z-0 bg-indigo-50 blur-xl'></div>
            <div className='relative flex justify-center items-center w-full h-full'>
                <button
                    onClick={handlePrevClick}
                    className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-2 py-6 rounded-full opacity-75 hover:opacity-100'
                >
                    &lt;
                </button>
                <img src={imageSrc} alt="Enlarged" className="max-h-full max-w-full object-cover" />
                <button
                    onClick={handleNextClick}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-2 py-6 rounded-full opacity-75 hover:opacity-100'
                >
                    &gt;
                </button>
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-2 p-2 text-white bg-red-500 rounded-full"
                >
                    &times;
                </button>
            </div>
        </div>,
        document.getElementById('portal')
    );
}
