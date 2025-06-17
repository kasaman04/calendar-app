import TimeLabel from './TimeLabel';

export default function TimeBar24() {
  return (
    <div className="relative w-full">
      {/* メインのタイムバー */}
      <div className="h-3 rounded-full border border-gray-700 grid grid-cols-6 gap-0">
        {/* 6つの区画 - 最後以外は右側にボーダーを追加 */}
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className={`h-full ${index < 5 ? 'border-r border-gray-700' : ''} ${
              index === 0 ? 'rounded-l-full' : ''
            } ${index === 5 ? 'rounded-r-full' : ''}`}
          />
        ))}
      </div>
      
      {/* タイムラベル */}
      {['4', '8', '12', '16', '20'].map((time, index) => (
        <TimeLabel key={time} index={index + 1} text={time} />
      ))}
    </div>
  );
}