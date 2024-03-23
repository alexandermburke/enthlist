import { Poppins } from 'next/font/google';
import React, { useEffect } from 'react'
import Button from './Button';
import { useSearchParams } from 'next/navigation';
import AuthError from './AuthError';
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function Register(props) {
    const { username, setUsername, email, setEmail, password, setPassword, step, goBack, handleSubmit, userExists, submitting, error, isVerifying } = props

    const searchParams = useSearchParams()
    useEffect(() => {
        const URLusername = searchParams.get('username')
        if (!URLusername) { return }
        setUsername(URLusername)
    }, [searchParams, setUsername])

    return (
        <>
            <div className='flex flex-col gap-6'>
                <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}>Join <span className='blueGradient'>enthusiastlist.app</span></h2>
                <p className='text-center'>Sign up for free! </p>
            </div>
            <div className='flex flex-col gap-4 text-base sm:text-lg'>
                {error && (<AuthError errMessage={error} />)}
                {step === 0 ? (<>
                    <div className={'flex items-stretch border border-solid border-white  rounded-full w-full max-w-[600px] mx-auto bg-white overflow-hidden '}>
                        <div className='flex items-stretch py-4 pl-4'>
                            <p>enhthusiastlist.app/</p>
                        </div>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className='w-full  flex-1 bg-white outline-none  py-4 ' placeholder='username' />
                        <div className='px-2 rounded-full aspect-square pr-4 grid place-items-center'>
                            {userExists ? (
                                <i className="fa-solid text-pink-400 fa-xmark"></i>
                            ) : (
                                <i className="fa-solid text-emerald-400 fa-check"></i>
                            )}
                        </div>
                    </div>
                    <input value={email} type='email' onChange={(e) => setEmail(e.target.value)} className='flex-1 bg-white border border-solid border-white rounded-full max-w-[600px] mx-auto w-full outline-none  p-4 ' placeholder='Email' />
                </>) : (<>
                    <p className=' text-center'>Choose a strong password with at least 8 characters.</p>

                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='flex-1 bg-white border border-solid border-white rounded-full max-w-[600px] mx-auto w-full outline-none p-4 ' placeholder='Password' />
                </>)}
                <div className='flex items-stretch gap-4 max-w-[600px] mx-auto w-full'>
                    {step === 1 && (
                        <button onClick={goBack} className=' w-fit p-4 rounded-full mx-auto bg-white px-8 duration-200 hover:opacity-60'>&larr; Back</button>
                    )}
                    <Button text={step === 0 ? 'Create account' : 'Continue'} saving={submitting ? 'Submitting' : isVerifying ? 'Verifying username' : ''} clickHandler={handleSubmit} />
                </div>
            </div>
        </>
    )
}
