'use client'
import CoolLayout from '@/components/CoolLayout'
import Main from '@/components/Main'
import { Poppins } from 'next/font/google';
import React from 'react'
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function ErrorPage() {
    return (
        <CoolLayout>
            <Main>
                <div className='flex flex-1 items-center justify-center flex-col gap-4'>
                    <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}> <span className='blueGradient'>ERROR</span></h2>
                    <p className='text-center text-blue-400'>Oops something went wrong!</p>
                    <p></p>
                </div>
            </Main >
        </CoolLayout>
    )
}
