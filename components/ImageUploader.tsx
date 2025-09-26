import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  language: 'vi' | 'en';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
          onImageUpload(file);
      }
  }, [onImageUpload]);

  return (
    <div 
      className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all duration-300 relative overflow-hidden group"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-2">
            <p className="text-white text-lg font-semibold">{language === 'vi' ? 'Kéo thả hoặc nhấn để đổi ảnh' : 'Drag, drop or click to change'}</p>
          </div>
        </>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
          <p className="font-semibold">{language === 'vi' ? 'Kéo thả hoặc tải ảnh lên' : 'Drag & drop or upload'}</p>
          <p className="text-sm">{language === 'vi' ? 'Định dạng: PNG, JPG, hoặc WEBP' : 'PNG, JPG, or WEBP'}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;