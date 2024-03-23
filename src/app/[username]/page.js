import CoolLayout from '@/components/CoolLayout';
import Main from '@/components/Main';
import { Poppins } from 'next/font/google';
import React from 'react'
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });

export default function CV() {
  return (

    <CoolLayout>
      <Main>
        <div className='flex flex-1 items-center justify-center flex-col gap-8'>
          <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}> <span className='blueGradient'>	༼ つ ◕_◕ ༽つ</span></h2>
          <p className='text-center text-blue-400'>This page is under construction!</p>
          <p></p>
        </div>
      </Main >
    </CoolLayout>)
}
