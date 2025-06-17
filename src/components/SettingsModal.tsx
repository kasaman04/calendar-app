import React from 'react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const handleModeSelect = (mode: string) => {
    if (mode === "ざっくり") {
      // 6マス版HTMLファイルを開く
      window.open('/calendar-card.html', '_blank');
    } else if (mode === "きっちり") {
      // 24マス版HTMLファイルを開く
      window.open('/calendar-card-24h.html', '_blank');
    }
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              タイムバーモード選択
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              使用したいタイムバーを選択してください
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleModeSelect("ざっくり")}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 mb-1">ざっくり管理</div>
              <div className="text-sm text-gray-600">6つの時間帯で管理（4時間単位）</div>
              <div className="text-xs text-blue-600 mt-1">横型タイムバー</div>
            </button>

            <button
              onClick={() => handleModeSelect("きっちり")}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 mb-1">きっちり管理</div>
              <div className="text-sm text-gray-600">24時間で詳細管理（1時間単位）</div>
              <div className="text-xs text-blue-600 mt-1">縦型タイムバー</div>
            </button>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;