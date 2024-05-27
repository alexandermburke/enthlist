import { Poppins } from 'next/font/google';
import React from 'react'
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function LogoFiller() {
    return (
        <div className='grid place-items-center flex-1 text-center '>
            <div className='grid grid-cols-2 gap-1'>
                <p className='capitalize text-xl w-30 sm:w-36 text-indigo-500 hover:text-gray-500'>
                   1
                    
                </p>

                <p className='capitalize text-xl w-30 sm:w-36 text-black hover:text-gray-500'>
                   2
                    
                </p>
            </div>
        </div>
    )
}
