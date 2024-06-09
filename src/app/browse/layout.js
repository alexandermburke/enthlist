'use client'
import CoolLayout from '@/components/CoolLayout'
import Login from '@/components/Login'
import Main from '@/components/Main'
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import SearchBtn from '@/components/SearchButton';

export default function SubLayout({ children }) {
    const { currentUser, loading } = useAuth()

    let content = children
    if (loading) {
        content = (
            <div className='flex items-center justify-center flex-col flex-1'>
                <i className="fa-solid fa-spinner text-white animate-spin text-4xl sm:text-5xl md:text-6xl"></i>
      
            </div>
        )
    }

    if (!currentUser && !loading) {
        content = (
            <Login />
        )
    }

    return (
        <CoolLayout>
            <Main>
          
                {content}
            </Main>
        </CoolLayout>
    )
}
