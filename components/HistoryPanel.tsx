import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShareIcon } from './icons/ShareIcon';
import { HistoryItem } from '../App';
import Loader from './Loader';


interface HistoryPanelProps {
  historyItems: HistoryItem[];
  onImageSelect: (item: HistoryItem) => void;
  onImageDelete: (id: number) => void;
  language: 'vi' | 'en';
  isLoading: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ historyItems, onImageSelect, onImageDelete, language, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-500">
        <Loader />
        <p className="mt-3 font-semibold">{language === 'vi' ? 'Đang tải thư viện...' : 'Loading gallery...'}</p>
      </div>
    );
  }
  
  if (historyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p className="font-semibold">{language === 'vi' ? 'Chưa có hình' : 'Gallery is empty'}</p>
        <p className="text-sm mt-1">{language === 'vi' ? 'Những hình được tạo sẽ lưu trữ tại đây' : 'Generated images will be stored here.'}</p>
      </div>
    );
  }
  
  const handleDownload = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `women-studio-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onImageDelete(id);
  };
  
  const handleShare = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    
    if (!navigator.share) {
        alert(language === 'vi' ? 'Trình duyệt của bạn không hỗ trợ chức năng chia sẻ.' : 'Your browser does not support the share feature.');
        return;
    }

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `women-studio-${Date.now()}.png`, { type: blob.type });

        await navigator.share({
            title: 'WOMEN STUDIO Image',
            text: language === 'vi' ? 'Hãy xem bức ảnh tuyệt vời tôi đã tạo bằng WOMEN STUDIO!' : 'Check out this amazing image I created with WOMEN STUDIO!',
            files: [file],
        });
    } catch (error) {
        console.error('Error sharing:', error);
        if ((error as DOMException).name !== 'AbortError') {
             alert(language === 'vi' ? 'Không thể chia sẻ hình ảnh.' : 'Could not share the image.');
        }
    }
  };


  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-lg p-2 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
        {historyItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-md overflow-hidden cursor-pointer group focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-500 bg-slate-100 dark:bg-slate-800"
              onClick={() => onImageSelect(item)}
              aria-label={`View generated image ${item.id}`}
            >
              <img
                  src={item.url}
                  alt={`Generated image ${item.id}`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                      onClick={(e) => handleDownload(e, item.url)}
                      className="p-3 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                      aria-label={language === 'vi' ? 'Tải xuống' : 'Download'}
                      title={language === 'vi' ? 'Tải xuống' : 'Download'}
                  >
                      <DownloadIcon className="w-5 h-5" />
                  </button>
                  <button
                      onClick={(e) => handleShare(e, item.url)}
                      className="p-3 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                      aria-label={language === 'vi' ? 'Chia sẻ' : 'Share'}
                      title={language === 'vi' ? 'Chia sẻ' : 'Share'}
                  >
                      <ShareIcon className="w-5 h-5" />
                  </button>
                  <button
                      onClick={(e) => handleDelete(e, item.id!)}
                      className="p-3 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                      aria-label={language === 'vi' ? 'Xóa' : 'Delete'}
                      title={language === 'vi' ? 'Xóa' : 'Delete'}
                  >
                      <TrashIcon className="w-5 h-5" />
                  </button>
              </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default HistoryPanel;