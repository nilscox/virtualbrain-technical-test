import { typeStyle } from '../typeColors';

type TypeBadgeProps = {
  type: string;
};

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      style={typeStyle(type)}
      className="rounded-full bg-type px-2 py-0.5 text-xs font-semibold text-type-ink capitalize"
    >
      {type}
    </span>
  );
}
