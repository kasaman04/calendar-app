
interface TimeLabelProps {
  index: number;
  text: string;
}

export default function TimeLabel({ index, text }: TimeLabelProps) {
  return (
    <span
      className="absolute -translate-x-1/2 top-full mt-1 text-sm font-medium text-gray-800"
      style={{ left: `${(index / 6) * 100}%` }}
    >
      {text}
    </span>
  );
}