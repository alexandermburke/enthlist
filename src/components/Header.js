'use client'
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function Header() {
    const { currentUser, logout } = useAuth()
    const [showMenu, setShowMenu] = useState(false)
    const [showText, setShowText] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    async function copyToClipboard() {
        setShowText(true)
        navigator.clipboard.writeText(`https://enthusiastlist.app/${currentUser.displayName}`)
        await new Promise(r => setTimeout(r, 2000));
        setShowText(false)
    }

    let shareBtn = (
        <div className='flex flex-col relative'>
            <button onClick={() => copyToClipboard()} className='ml-4  duration-200 overflow-hidden  p-0.5 rounded-full relative'>
                <div className='absolute inset-0 blueBackground ' />
                <div className='p-4 flex items-center justify-center gap-4 relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white relative'>
                    <p className=''>{showText ? 'Link copied' : 'Share link'}</p>
                </div>
            </button>

        </div>
    )
    let navActions = (
        <nav className='hidden items-stretch md:flex'>
            <Link href={'/browse'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                <p className=''>Browse</p>
            </Link>
            <Link href={'/#about'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                <p className=''>About</p>
            </Link>
            <Link href={'/admin'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                <p className=''>{currentUser ? 'Dashboard' : 'Login'}</p>
            </Link>
            <Link href={'/register'} className='ml-4  duration-200 overflow-hidden  p-0.5 rounded-full relative'>
                <div className='absolute inset-0 blueBackground ' />
                <div className='p-4 grid place-items-center relative z-10 bg-white rounded-full hover:bg-transparent duration-200 hover:text-white'>
                    <p className=''>Sign up free</p>
                </div>
            </Link>
        </nav>
    )

    let menuActions = (
        <nav className='flex flex-col gap-2'>
            <Link className='p-2 rounded-lg border-solid border border-blue-50 hover:opacity-60 duration-200' href={'/#about'}><p>About</p></Link>
            <Link className='p-2 rounded-lg border-solid border border-blue-50 hover:opacity-60 duration-200' href={'/admin'}><p>{currentUser ? 'Dashboard' : 'Login'}</p></Link>
            <Button clickHandler={() => { router.push('/register') }} text="Sign up free" />
        </nav>
    )

    if (pathname.split('/')[1] === 'admin' && currentUser) {
        navActions = (
            <>
                <p className={'capitalize flex-1 ' + poppins.className}>Welcome <span>{currentUser.displayName}</span></p>
                <div className='hidden items-stretch md:flex'>
                    <Link href={'/admin'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                        <p>Dashboard</p>
                    </Link>
                    <Link href={'/admin/account'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                        <p>Account</p>
                    </Link>
                    <button onClick={logout} href={'/admin/account'} className='border border-solid duration-200 border-transparent hover:border-blue-100 px-4 grid place-items-center rounded-full'>
                        <p>Logout</p>
                    </button >
                    {shareBtn}
                </div>
            </>
        )
        menuActions = (
            <nav className='flex flex-col gap-2'>
                <Link href={'/admin'} className='p-2 rounded-lg border-solid border border-blue-50 hover:opacity-60 duration-200'><p>Dashboard</p></Link>
                <Link href={'/admin/account'} className='p-2 rounded-lg border-solid border border-blue-50 hover:opacity-60 duration-200'><p>Account</p></Link>
                <button className='p-2 text-left rounded-lg border-solid border border-blue-50 hover:opacity-60 duration-200' onClick={logout}><p>Logout</p></button>
                {shareBtn}
            </nav>
        )
    }

    return (
        <header className=' z-[100] sticky top-10  px-4  flex flex-col'>
            <div className='flex items-center justify-between gap-4 max-w-[1200px] mx-auto w-full shadow  overflow-hidden  p-2  bg-white blueShadow  rounded-full'>
                <Link href={'/'}>
                    <h1 className={'text-xl px-3 sm:text-2xl blueGradient font-medium sm:px-4  ' + poppins.className}>enthusiastlist</h1>
                    
                </Link>
                {navActions}
                <button onClick={() => { setShowMenu(!showMenu) }} className='grid md:hidden place-items-center p-4  duration-200 rounded-full'>
                    {showMenu ? (
                        <i className="fa-solid fa-xmark text-lg"></i>
                    ) : (
                        <i className="fa-solid fa-bars text-lg"></i>
                    )}
                </button>
            </div>

            {showMenu && (
                <div className='absolute flex flex-col left-4 right-4 md:hidden top-full pt-4'>
                    <div className='flex flex-col bg-white dropShadow rounded-2xl p-4'>
                        {menuActions}
                    </div>
                </div>
            )}
        </header>
    )
}
