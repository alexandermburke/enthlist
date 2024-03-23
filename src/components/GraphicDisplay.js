'use client'
import React, { useState, useEffect } from 'react';

export default function GraphicDisplay(props) {
    const { real, children, username } = props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Add more image paths as needed
    const [transition, setTransition] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTransition(true);
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTransition(false);
        }, 500); // Duration of CSS transition

        return () => clearTimeout(timeoutId);
    }, [currentImageIndex]);

    return (
        <div className={"flex flex-col dropShadow overflow-hidden rounded-b-lg w-full mx-auto " + (real ? ' max-w-[1200px]' : ' max-w-[500px]')}>
            <div className={"rounded-t-xl p-4 bg-white opacity-60  flex items-center gap-2 "}>
                {[1, 2, 3].map((val, i) => (
                    <div key={i} className={"rounded-full aspect-square bg-indigo-300 " + (real ? ' w-3 sm:w-3.5 ' : ' w-.5 sm:w-3')} />
                ))}
                <p className={'text-xl text-slate-500 pl-2 ' + (real ? ' text-base sm:text-lg font-light ' : ' text-xs sm:text-sm')}>New Listings</p>
            </div>
            <div className={"flex bg-white flex-1 overflow-hidden relative"}>
                <div className="slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)`, transition: transition ? 'transform 0.5s ease-in-out' : 'none', display: 'flex' }}>
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`slide-${index}`} className="image" style={{ width: '100%', flex: 'none' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}