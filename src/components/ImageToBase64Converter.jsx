import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageToBase64Converter = ({ imageUrl, height, className }) => {
    const [base64Image, setBase64Image] = useState('');

    useEffect(() => {
        // Fetch the image using axios
        axios.get(imageUrl, { responseType: 'arraybuffer' })
            .then(response => {
                // Convert the image data to base64
                const base64Data = Buffer.from(response.data, 'binary').toString('base64');
                const mimeType = response.headers['content-type'];
                const base64ImageString = `data:${mimeType};base64,${base64Data}`;
                setBase64Image(base64ImageString);
            })
            .catch(error => {
                console.error('Error fetching or converting image:', error);
            });
    }, [imageUrl]);

    return (
        <div>
            {base64Image ? <img src={base64Image} alt="Converted" className={`rounded-xl ${className}`}/> : <div className={`rounded-xl bg-gray-100 ${className}`}>
                </div>}
        </div>
    );
};

export default ImageToBase64Converter;
