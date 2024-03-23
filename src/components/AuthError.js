import React from 'react'

export default function AuthError(props) {
  const { errMessage } = props
  return (
    <div className='px-4 py-2 rounded-full text-xs sm:text-sm bg-white mx-auto text-center max-w-[600px] w-full border border-solid border-pink-400 text-pink-400'>
      <p>{errMessage}</p>
    </div>
  )
}
