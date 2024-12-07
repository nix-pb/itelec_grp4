import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../ImageDropBox/index.css';

const ImageDropBox = ({ onImageUpdate }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                console.log('Image URL:', imageUrl);
                setImagePreview(imageUrl);
                // Check if onImageUpdate is defined
                if (onImageUpdate) {
                    onImageUpdate(imageUrl);
                } else {
                    console.error('onImageUpdate is not defined');
                }
            };
            reader.readAsDataURL(file);
        });
    }, [onImageUpdate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div className="image-dropbox" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here...</p>
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                </div>
            )}
        </div>
    );
};

export default ImageDropBox;
