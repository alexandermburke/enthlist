import React from 'react'
import SectionWrapper from './Layouts/SectionWrapper'
import Bio from './Layouts/Bio'
import Education from './Layouts/Education'
import WorkExperience from './Layouts/WorkExperience'
import Skills from './Layouts/Skills'
import Projects from './Layouts/Projects'
import { Open_Sans } from 'next/font/google'
import sortResumeSections from '@/utils'
import Link from 'next/link'
const opensans = Open_Sans({
    subsets: ["latin"], weight: ['400', '300', '500', '600', '700'], style: ['normal', 'italic'],
});



export default function ListingViewer(props) {
    const { userData, resumeSections, demo, isPaid } = props

    const sections = {
        bio: <Bio viewer val={resumeSections.bio} />,
        education: <Education viewer resumeSections={resumeSections} />,
        work_experience: <WorkExperience viewer resumeSections={resumeSections} />,
        skills: <Skills viewer resumeSections={resumeSections} />,
        projects: <Projects viewer resumeSections={resumeSections} />
    }

    return (
        <div className={'flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 ' + opensans.className}>
            <div className='flex flex-col relative'>
                <p className='text-3xl sm:text-4xl capitalize md:text-5xl w-full o'>{userData.name || placeHolders.name}</p>
                {(!isPaid || demo) && (<Link target='_blank' href={'/register'} className='absolute top-1/2 -translate-y-1/2 right-0 text-slate-300 hover:text-blue-300 duration-200' >
                    <p >hyr.sh</p>
                </Link>)}
            </div>
            {Object.keys(userData).reduce((acc, curr) => acc ? acc : !!userData[curr], false) && (<div className={'flex items-center justify-between gap-4 overflow-scroll'} >
                {Object.keys(userData).filter(key => (userData[key] && key !== 'name')).map((userKey, userKeyIndex) => {
                    return (
                        <div className='flex items-center gap-4' key={userKeyIndex}>
                            <p className={'whitespace-nowrap font-light '}>{userData[userKey]}</p>
                        </div>
                    )
                })}
            </div>)}
            {'bio' in resumeSections && (
                <>
                    {sections['bio']}
                </>
            )}
            <hr />
            {sortResumeSections(Object.keys(resumeSections)).filter(val => val !== 'bio').map((resumeSection, resumeSectionIndex) => {
                return (
                    <SectionWrapper viewer title={resumeSection} key={resumeSectionIndex}>
                        {sections[resumeSection]}
                    </SectionWrapper>
                )
            })}
        </div>
    )
}