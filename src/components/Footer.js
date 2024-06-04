import { Poppins } from 'next/font/google';
import Link from 'next/link'
import React from 'react'
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });

export default function Footer() {

    return (
        <footer className='flex flex-col bg-indigo-800 text-white py-10'>
            <div className=' flex flex-col sm:flex-row items-center justify-center flex-wrap gap-10 sm:gap-14 md:gap-20 mx-auto py-8 px-8 text-base'>
                <div className='flex flex-col w-fit shrink-0 gap-4 whitespace-nowrap text-center'>
                    <div className='flex flex-col mx-auto w-fit'>
                        <Link href={'/'}>
                            <h1 className={'text-xl px-3 sm:text-2xl  sm:px-4 ' + poppins.className}>enthusiastlist.app</h1>
                        </Link>
                    </div>
                    <p className='mx-auto text-sm'>Copyright © 2024 Alexander Burke</p>
                </div>
                <div className='flex flex-col sm:flex-row gap-10 sm:gap-14 md:gap-20'>

                    <div className='flex flex-col gap-4 w-fit'>
                        <h3 className='font-bold'>Navigation</h3>
                        <div className='flex flex-col gap-1 text-sm'>
                            <Link className='relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full' href={'/browse'}><p>Browse</p></Link>
                            <Link className='relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full' href={'/admin'}><p>Login</p></Link>
                            <Link className='relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full' href={'/register'}><p>Join</p></Link>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-fit'>
                        <h3 className='font-bold'>Contact</h3>
                        <div className='flex flex-col gap-1 text-sm'>

                            <Link href={'https://github.com/alexandermburke/enthlist/'} target='_blank' className='flex items-center gap-2 relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full'>
                                <i className="fa-solid fa-envelope"></i>
                                <p className=''>Contact form</p>
                            </Link>
                    
                            <div className='flex items-center gap-2 relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full'>
                                <i className="fa-solid fa-at"></i>
                                <p >support@enthusiastlist.app</p>
                            </div>
                            {/* <Link href={'/learn'} target='_blank' className='flex items-center gap-2 relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full'>
                                <i className="fa-brands fa-linkedin-in"></i>
                                <p >LinkedIn</p>
                            </Link> */}
                        </div>
                    </div>
                    {/* <div className='flex flex-col gap-4 w-fit'>
                        <h3 className='font-bold'>Legal</h3>
                        <div className='flex flex-col gap-1 text-sm'>

                            <Link href={'/privacy'}><p className='relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full'>Privacy Policy</p></Link>
                            <Link href={'/legal'}><p className='relative w-fit overflow-hidden after:absolute after:right-full after:bottom-0 after:h-[1px] after:bg-white after:w-full after:duration-200 hover:after:translate-x-full'>Legal Notice</p></Link>
                        </div>
                    </div> */}
                </div>

            </div>
        </footer>
    )
}
