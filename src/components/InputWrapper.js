import React from 'react'

export default function InputWrapper(props) {
    const { children, value, multiLine, minHeight } = props
    return (
        <div className={'flex flex-col w-full relative min-w-[200px] min-h-60 ' + (multiLine ? ' ' : ' truncate') + (minHeight ? ` min-h-[${minHeight}] ` : ' ')}>
            {value.split('\n').map((line, lineIndex) => {
                return (
                    <p key={lineIndex} className='opacity-0 z-[-1]'>{line || 'hello'} </p>
                )
            })}
            {children}
        </div>
    )
}
