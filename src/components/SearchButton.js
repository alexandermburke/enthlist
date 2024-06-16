'use client'
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });

export default function RegisterBtn(props) {
    const { leftAligned, noBtn, onSearch } = props;
    const [search, setsearch] = useState('');

    function validatesearch() {
        if (!search) { return; }
        onSearch(search);
    }

    return (
        <div className={'flex items-stretch text-base sm:text-lg rounded-full w-full  bg-white overflow-hidden ' + (leftAligned ? ' max-w-[600px] mx-auto lg:max-w-[70%] lg:ml-0' : ' max-w-[600px] mx-auto')}>
            <div className='flex items-stretch py-4 pl-4'>
                <p></p>
            </div>
            <input value={search} onChange={(e) => setsearch(e.target.value)} className='w-full flex-1 bg-white outline-none border-none py-4 ' placeholder='Search Listings' />
            <button onClick={validatesearch} className='ml-4  duration-200 overflow-hidden  p-0.5 rounded-full relative blueShadow '>
                <div className='absolute inset-0 blueBackground ' />
                <div className={'h-full px-4 grid place-items-center relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white  ' + poppins.className}>
                    <p>
                        Search
                    </p>
                </div>
            </button>
        </div>
    );
}
