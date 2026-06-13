import React from 'react';
import './ImageUploader.css';

const ImageUploader = ({ label, onChange }) => {
  return (
    <label className="image-uploader">
      <span>{label}</span>
      <div className="image-dropzone">
        <span>Upload image</span>
        <input type="file" accept="image/*" onChange={onChange} />
      </div>
    </label>
  );
};

export default ImageUploader;
