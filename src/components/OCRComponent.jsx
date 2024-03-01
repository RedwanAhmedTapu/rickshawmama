import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const HandwrittenTextRecognition = () => {
  const [handwrittenText, setHandwrittenText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const performHandwrittenTextRecognition = async () => {
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await Tesseract.recognize(selectedFile, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      });

      setHandwrittenText(data.text);
      console.log(data.text)
    } catch (error) {
      console.error('Error performing handwritten text recognition:', error);
      alert('An error occurred during handwritten text recognition.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={performHandwrittenTextRecognition} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Recognize Handwritten Text'}
      </button>
      {handwrittenText && (
        <div>
          <h2>Handwritten Text:</h2>
          <p>{handwrittenText}</p>
        </div>
      )}
    </div>
  );
};

export default HandwrittenTextRecognition;
