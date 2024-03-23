import React from 'react'

export default function DeleteBtn(props) {
    const { deleteHander, groupHover } = props
    return (
        <button onClick={deleteHander} className={'absolute opacity-0  duration-200  px-2 rounded-full aspect-square text-white hover:bg-blue-200 bg-blue-100 right-0 top-0 z-[14] ' + ` group-hover/${groupHover}:opacity-100`}>
            <i className="fa-regular fa-trash-can"></i>
        </button>
    )
}
