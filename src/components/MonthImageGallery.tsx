import React, { useState, useEffect } from 'react';
import { MonthImage } from '../types';
import { useRecords } from '../store/useRecords';
import ImagePicker from './ImagePicker';

interface MonthImageGalleryProps {
  year: number;
  month: number;
}

const MonthImageGallery: React.FC<MonthImageGalleryProps> = ({ year, month }) => {
  const { addImageToMonth, removeImageFromMonth, getMonthImages } = useRecords();
  const [images, setImages] = useState<MonthImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<MonthImage | null>(null);

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

  const handleImageSelect = (image: MonthImage) => {
    addImageToMonth(year, month, image);
  };

  const handleImageDelete = (imageId: string) => {
    if (confirm('この写真を削除しますか？')) {
      removeImageFromMonth(year, month, imageId);
    }
  };

  const handleImageClick = (image: MonthImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {year}年{month}月の写真 ({images.length}枚)
        </h3>
        <ImagePicker onImageSelect={handleImageSelect} />
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>まだ写真がありません</p>
          <p className="text-sm">上のボタンから写真を追加してみましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.dataUrl}
                  alt={image.fileName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageDelete(image.id);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div className="max-w-full max-h-full">
            <img
              src={selectedImage.dataUrl}
              alt={selectedImage.fileName}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={handleCloseModal}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              {selectedImage.fileName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthImageGallery;