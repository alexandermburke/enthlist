import React, { useState } from 'react'
import Button from './Button';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthError from './AuthError';
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticating, setAuthenticating] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()

  async function handleSubmit() {
    if (authenticating) { return }
    setError(false)
    setAuthenticating(true)
    try {
      await login(email, password)
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <h2 className={'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center  ' + poppins.className}> <span className='blueGradient'>enthusiastlist.app</span></h2>
        <p className='text-center'>Login to your account! </p>
      </div>
      <div className='flex flex-col gap-4 text-base sm:text-lg'>
        {error && (<AuthError errMessage={error} />)}
        <input value={email} onChange={(e) => setEmail(e.target.value)} className='flex-1 bg-white rounded-full max-w-[600px] mx-auto w-full outline-none border border-solid border-white p-4 ' placeholder='Email' />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='flex-1 bg-white rounded-full max-w-[600px] mx-auto w-full outline-none border border-solid border-white p-4 ' placeholder='Password' />
        <div className={'flex items-stretch gap-4 max-w-[600px] mx-auto w-full duration-200 ' + (authenticating ? ' cursor-not-allowed opacity-60 ' : ' ')}>
          <Button text={'Submit'} saving={authenticating ? 'Submitting' : ''} clickHandler={handleSubmit} />
        </div>
        <p className='mx-auto text-sm sm:text-base'>Don&apos;t have an account? <Link className='blueGradient pl-2' href={'/register'}>Sign up</Link></p>
      </div>
    </>
  )
}
