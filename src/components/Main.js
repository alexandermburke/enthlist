import React from 'react'

export default function Main(props) {
    const { children } = props
    return (
        <main className="flex max-w-[1200px] gap-10 sm:gap-14 min-h-screen md:gap-20 mx-auto w-full flex-1 flex-col p-4 py-20 sm:py-24">
            {children}

        </main>
    )
}
