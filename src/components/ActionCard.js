import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });


export default function ActionCard(props) {
    const { children, title, actions, nav, lgHeader, noFlex, subTitle } = props
    return (
        <div className={'flex flex-col gap-4 p-4 sm:p-8 rounded-2xl bg-white min-h-80 ' + (noFlex ? ' ' : ' flex-1 ')}>
            {nav && nav}
            <div className='flex items-center justify-between gap-4'>
                <div className="flex items-center gap-4 ">
                <p className={'font-medium ' + ('text-lg blueGradient sm:text-xl md:text-1xl py-2 ' + poppins.className)}>{title} </p>
               {subTitle && (<p className="italic capitalize">{subTitle}</p>)}
                </div>
                {actions && actions}
            </div>
            {children}
        </div>
    )
}