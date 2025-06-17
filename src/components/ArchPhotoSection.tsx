import React, { useState, useEffect } from 'react';
import { MonthImage } from '../types';
import { useRecords } from '../store/useRecords';

interface ArchPhotoSectionProps {
  year: number;
  month: number;
}

const ArchPhotoSection: React.FC<ArchPhotoSectionProps> = ({ year, month }) => {
  const { addImageToMonth, getMonthImages } = useRecords();
  const [images, setImages] = useState<MonthImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const updateImages = () => {
      setImages(getMonthImages(year, month));
    };

    updateImages();

    const handleImagesChanged = () => {
      updateImages();
    };

    window.addEventListener('imagesChanged', handleImagesChanged);
    return () => {
      window.removeEventListener('imagesChanged', handleImagesChanged);
    };
  }, [year, month, getMonthImages]);

  // デフォルト画像のURL（月ごと）
  const getDefaultImage = (month: number) => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=180&fit=crop', // January
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=180&fit=crop', // February
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=180&fit=crop', // March
      'https://images.unsplash.com/photo-1563789031959-4c53abc684c3?w=400&h=180&fit=crop', // April
      'https://images.unsplash.com/photo-1592062644994-6fc4faf8e8c2?w=400&h=180&fit=crop', // May
      'https://images.unsplash.com/photo-1597848212624-e6421bb98fb6?w=400&h=180&fit=crop', // June
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=180&fit=crop', // July
      'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=400&h=180&fit=crop', // August
      'https://images.unsplash.com/photo-1601985705806-5b2e9b3b71b4?w=400&h=180&fit=crop', // September
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=180&fit=crop', // October
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=180&fit=crop', // November
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=180&fit=crop'  // December
    ];
    return defaultImages[month - 1] || defaultImages[0];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const dataUrl = await fileToDataUrl(file);
        const newImage: MonthImage = {
          id: generateId(),
          fileName: file.name,
          dataUrl,
          uploadDate: new Date().toISOString()
        };

        addImageToMonth(year, month, newImage);
      }
    } catch (error) {
      console.error('画像の処理中にエラーが発生しました:', error);
      alert('画像の処理中にエラーが発生しました');
    } finally {
      setIsUploading(false);
      event.target.value = '';
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

  // 表示する画像を決定（最大3枚、なければデフォルト）
  const displayImages = images.length > 0 ? images.slice(0, 3) : [];
  const defaultImage = getDefaultImage(month);

  return (
    <div className="flex gap-2 justify-center mb-2">
      {/* 3つのarch-photoを表示 */}
      {[0, 1, 2].map((index) => {
        const image = displayImages[index];
        const backgroundImage = image ? image.dataUrl : defaultImage;
        
        return (
          <div key={index} className="relative">
            <div
              className="arch-photo cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundImage: `url("${backgroundImage}")`,
                width: '140px',
                height: '160px',
                borderTopLeftRadius: '100%',
                borderTopRightRadius: '100%',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              {/* アップロード中のオーバーレイ */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-full">
                  <div className="text-white text-sm">処理中...</div>
                </div>
              )}
              
              {/* カメラアイコン（画像がない場合またはホバー時） */}
              {!image && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-t-full">
                  <div className="text-white text-3xl">📷</div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 隠しファイル入力 */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ArchPhotoSection;