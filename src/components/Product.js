import { Poppins } from 'next/font/google';
import React from 'react'
import ActionCard from './ActionCard';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '100', '200', '300', '500', '600', '700'] });

const completionSteps = [
    ['Complete your resume', 'fa-solid fa-pen-to-square', 'Fill out your resume in the display below by adding all the sections you feel relevant to your experience; remember to keep your resume to approximately 1 page in length. You can view your resume by selecting the PDF Viewer button beneath, and can print the web page to a PDF that you can save to your local device. Be sure to adjust the print scale to get the perfect PDF fit.'],
    ['Create a cover letter', 'fa-solid fa-scroll', 'Once you have completed your resume, create a new listing, completing all the details relevant to the job application. Once you have added in the details in addition to pasting in the job application, you can generate your perfect job specific cover letter and make any final adjustments you feel necessary.'],
    ['Share your link', 'fa-solid fa-share', 'With your resume complete and saved, you can choose to publish your resume and have a live version at your special link. You can share this link with anyone!']
]

const extras = [
    {
        name: "Build your professional listing!",
        description:
            "Easily manage one (or more) professional listings using our template and save them to your profile.",
    },
    {
        name: "Upload car specific images.",
        description:
            "Generate more interest by adding pictures of your vehicle to the listing including interior, exterior & engine bay pictures.",
    },
    {
        name: "Share your link to potential buyers.",
        description:
            "Share your personal link to allow anyone to view or inquire about your car.",
    },
];

export default function Product() {

    return (
        <section className='flex flex-col gap-10 p-4' id='about'>
            <div className="flex flex-col gap-4">
                <div
                    className="mx-auto w-[1.5px] h-12 sm:h-16 md:h-20 bg-gradient-to-b from-transparent to-blue-400"
                />
                <div
            //        className="w-10 sm:w-12 aspect-square rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 mx-auto grid place-items-center"
                >
                    <p className="jetbrains text-white">1</p>
                </div>
                <div className="mx-auto">
                    <h4
                        className="jetbrains text-center font-bold text-4xl sm:text-5xl md:text-6xl text-slate-800  py-4 sm:py-6 md:py-8"
                    >
                        <span className="jetbrains blueGradient">Sell</span> your car
                    </h4>
                </div>
                <p
                    className="text-center text-base sm:text-lg md:text-xl max-w-[700px] mx-auto px-8 md:px-0"
                >
                    Create and manage all your listings and messages in one place, and share them with your personal link.
                </p>
            </div>

             <div className='flex flex-col gap-10 max-w-[600px] mx-auto w-full'>
                {extras.map((extra, extraIndex) => {
                    return (
                        <div className="flex items-stretch gap-8" key={extraIndex}>
                            <h6 className={'text-5xl sm:text-6xl md:text-7xl text-slate-400  font-semibold ' + poppins.className}>0{extraIndex + 1}</h6>
                            <div className='flex flex-col gap-4'>
                                <h4 className={'text-xl sm:text-2xl md:text-3xl font-medium '}>{extra.name}</h4>
                                <p className='text-slate-600'>{extra.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            {}
        </section>
    )
}



