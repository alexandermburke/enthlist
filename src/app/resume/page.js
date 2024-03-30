'use client'
import BoringLayout from '@/components/BoringLayout'
import CoolLayout from '@/components/CoolLayout'
import Main from '@/components/Main'
import ResumeViewer from '@/components/ListingViewer'
import React, { useEffect, useState } from 'react'
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });

export default function CVDemo() {
    const [userData, setUserData] = useState({})
    const [resumeSections, setResumeSections] = useState({})

    useEffect(() => {
        if (!localStorage) { return }
        let localData = localStorage.getItem('hyr')
        if (!localData) { return }
        localData = JSON.parse(localData)
        const { userData: localUserData, resumeSections: localResumeSections } = localData
        localUserData && setUserData(localUserData)
        localResumeSections && setResumeSections(localResumeSections)
    }, [])

    console.log(userData)
    console.log(resumeSections)
    if (!Object.keys(userData).length || !Object.keys(resumeSections).length) {
        return (
            <CoolLayout>
                <Main>
                    <div className='flex flex-1 items-center justify-center flex-col gap-4'>
                        <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}> <span className='blueGradient'>Umm...</span></h2>
                        <p className='text-center text-blue-400'>No resume found :0</p>
                    </div>
                </Main>
            </CoolLayout>
        )
    }

    return (
        <BoringLayout>
            <main className='max-w-[1200px] mx-auto flex flex-col w-full p-4 sm:p-8'>
                <ResumeViewer userData={userData} resumeSections={resumeSections} />
            </main>
        </BoringLayout>
    )
}
