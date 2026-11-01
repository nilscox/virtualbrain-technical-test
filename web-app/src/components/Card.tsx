import { memo, useState } from 'react';
import type { Pokemon } from 'shared';

type CardProps = {
  pokemon: Pokemon;
};

export function MiniCard({ pokemon }: CardProps) {
  return (
    <div className="flex h-10 items-center rounded-2xl bg-amber-300 p-2 text-black">
      <img src={pokemon.image} alt={pokemon.name} style={{ height: '100%' }} />
      <div className="ml-2 text-center">{pokemon.name}</div>
    </div>
  );
}

type SelectableCardProps = CardProps & {
  selected: boolean;
  disabled: boolean;
  onToggle: (pokemon: Pokemon) => void;
};

export const Card = memo(function Card({ pokemon, selected, disabled, onToggle }: SelectableCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled}
      onClick={() => onToggle(pokemon)}
      className={`w-62 rounded-2xl bg-linear-to-r from-amber-300 via-amber-100 to-amber-300 p-1 text-left text-black shadow-md outline-orange-400 not-aria-pressed:hover:outline-dashed focus-visible:outline-dashed aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-pressed:outline-4 aria-pressed:outline-solid`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transition: 'all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s',
      }}
    >
      <div className={`rounded-2xl bg-linear-to-br from-black/10 via-white/70 to-black/10`}>
        <div className="flex-col rounded-2xl p-4">
          <div className="flex justify-between gap-3">
            <div className="font-bold">{pokemon.name}</div>
            <div>HP: {pokemon.stats.HP}</div>
            {pokemon.apiTypes.map((type) => (
              <img
                key={type.name}
                className="self-end"
                src={type.image}
                alt={type.name}
                style={{ width: '20px' }}
              />
            ))}
          </div>
          <img
            className="my-3 bg-white outline-2 dark:bg-blue-950"
            src={pokemon.image}
            alt={pokemon.name}
            width={475}
            height={475}
            loading="lazy"
          />
          <div>Attack: {pokemon.stats.attack}</div>
          <div>Defense: {pokemon.stats.defense}</div>
          <div>Speed: {pokemon.stats.speed}</div>
        </div>
      </div>
    </button>
  );
});
