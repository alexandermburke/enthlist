import React from 'react';

export default function ImageWrapper({ value }) {
    return (
        <div className="image-wrapper">
            {value ? (
                <img src={value} alt="Uploaded" />
            ) : (
                <p className=''>No images uploaded</p>
                
            )}
        </div>
    );
}