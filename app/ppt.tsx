'use client'
import { useState } from 'react';
import { extractPptData, SlideData } from './pptExtractor';

export default function UploadPPT() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<SlideData[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      const extractedData = await extractPptData(uploadedFile);
      setOutput(extractedData);
    }
  };

  return (
    <div>
      <h1>Upload PowerPoint File</h1>
      <input type="file" accept=".pptx" onChange={handleFileUpload} />
      {output.length > 0 && (
        <div>
          <h2>Extracted Content</h2>
          {output.map((slide, index) => (
            <div key={index}>
              <h3>Slide {index + 1}</h3>
              <p>{slide.text}</p>
              {slide.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Slide ${index + 1} Image ${i + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
