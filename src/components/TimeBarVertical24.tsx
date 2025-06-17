
export default function TimeBarVertical24() {
  return (
    <div className="flex flex-col w-full max-h-96 overflow-y-auto">
      <div className="text-sm text-gray-600 mb-2 text-center">24時間タイムバー</div>
      <div className="grid grid-cols-1 gap-1">
        {Array.from({ length: 24 }, (_, hour) => (
          <div
            key={hour}
            className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 w-8">
              {hour.toString().padStart(2, '0')}
            </span>
            <div className="flex-1 mx-2 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-xs text-gray-500">
              {hour === 23 ? '23:59' : `${(hour + 1).toString().padStart(2, '0')}:00`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}