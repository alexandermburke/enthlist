import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

export default function BoringLayout(props) {
    const { children } = props
    return (
        <div className='flex flex-col flex-1 bg-white'>
            {/* <Header /> */}
            {children}
        </div>
    )
}
