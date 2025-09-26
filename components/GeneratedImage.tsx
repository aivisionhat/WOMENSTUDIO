
import React from 'react';
import Loader from './Loader';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  language: 'vi' | 'en';
  progress: number;
  onQuickEditClick: () => void;
  onDuplicateClick: () => void;
  isDuplicatable: boolean;
  isRerollable: boolean;
  onDownloadClick: () => void;
  onShareClick: () => void;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ 
  imageUrl, isLoading, error, language, progress, onQuickEditClick,
  onDuplicateClick, isDuplicatable, isRerollable, onDownloadClick, onShareClick
}) => {

  const renderContent = () => {
    if (isLoading) {
      const message = language === 'vi' 
            ? `AI đang sáng tạo kiệt tác của bạn... ${Math.round(progress)}%` 
            : `AI is creating your masterpiece... ${Math.round(progress)}%`;
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">{language === 'vi' ? 'Rất tiếc! Đã có lỗi xảy ra.' : 'Oops! Something went wrong.'}</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }

    if (imageUrl) {
      const duplicateText = isRerollable
        ? (language === 'vi' ? 'Tạo lại' : 'Re-roll')
        : (language === 'vi' ? 'Nhân bản' : 'Duplicate');
      
      return (
        <>
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={onQuickEditClick}
              className="bg-black/60 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-black/80 transition-all duration-300 backdrop-blur-sm shadow-lg border border-white/20 flex items-center gap-2"
              aria-label={language === 'vi' ? 'Chỉnh sửa nhanh' : 'Quick Edit'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
              {language === 'vi' ? 'Chỉnh sửa nhanh' : 'Quick Edit'}
            </button>
            {isDuplicatable && (
              <button
                onClick={onDuplicateClick}
                className="bg-black/60 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-black/80 transition-all duration-300 backdrop-blur-sm shadow-lg border border-white/20 flex items-center gap-2"
                aria-label={duplicateText}
              >
                <DuplicateIcon className="h-4 w-4" />
                {duplicateText}
              </button>
            )}
          </div>
          <div className="absolute top-4 right-4 z-10 flex flex-col sm:flex-row gap-2">
             <button
                onClick={onDownloadClick}
                className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all duration-300 backdrop-blur-sm shadow-lg border border-white/20"
                aria-label={language === 'vi' ? 'Tải xuống' : 'Download'}
                title={language === 'vi' ? 'Tải xuống' : 'Download'}
              >
                <DownloadIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onShareClick}
                className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all duration-300 backdrop-blur-sm shadow-lg border border-white/20"
                aria-label={language === 'vi' ? 'Chia sẻ' : 'Share'}
                title={language === 'vi' ? 'Chia sẻ' : 'Share'}
              >
                <ShareIcon className="h-5 w-5" />
              </button>
          </div>
          <img
            src={imageUrl}
            alt="Generated Portrait"
            className="w-full h-full object-contain rounded-lg animate-fade-in"
          />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-semibold">{language === 'vi' ? 'Hình ảnh được tạo sẽ xuất hiện tại đây.' : 'Your generated portrait will appear here.'}</p>
        <p className="text-sm mt-1">{language === 'vi' ? 'Hãy upload ảnh của bạn để bắt đầu tạo ảnh KOL.' : 'Upload your photo to start creating a KOL portrait.'}</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center p-2 relative">
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
      {renderContent()}
    </div>
  );
};

export default GeneratedImage;
