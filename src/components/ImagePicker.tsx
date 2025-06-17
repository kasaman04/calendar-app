import React, { useRef, useState } from 'react';
import { MonthImage } from '../types';

interface ImagePickerProps {
  onImageSelect: (image: MonthImage) => void;
  disabled?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    setIsLoading(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      const newImage: MonthImage = {
        id: generateId(),
        fileName: file.name,
        dataUrl,
        uploadDate: new Date().toISOString()
      };

      onImageSelect(newImage);
    } catch (error) {
      console.error('画像の処理中にエラーが発生しました:', error);
      alert('画像の処理中にエラーが発生しました');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isLoading}
      />
      <button
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${disabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }
        `}
      >
        {isLoading ? '処理中...' : '📷 写真を追加'}
      </button>
    </div>
  );
};

export default ImagePicker;