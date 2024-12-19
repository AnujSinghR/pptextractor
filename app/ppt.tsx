'use client';

import { useState } from 'react';
import { extractPptData, SlideData } from './pptExtractor';

export default function UploadPPT() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      setLoading(true);
      const extractedData = await extractPptData(uploadedFile);
      setOutput(extractedData);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        PowerPoint File Extractor
      </h1>
      
      <label className="block">
        <input
          type="file"
          accept=".pptx"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 inline-block">
          Upload PowerPoint File
        </div>
      </label>

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Extracting content... Please wait</p>
      )}

      {output.length > 0 && !loading && (
        <div className="mt-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-700">Extracted Content</h2>
          {output.map((slide, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Slide {index + 1}
              </h3>
              <p className="text-gray-700 mb-4">{slide.text || 'No text found'}</p>
              <div className="grid grid-cols-2 gap-4">
                {slide.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Slide ${index + 1} Image ${i + 1}`}
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
