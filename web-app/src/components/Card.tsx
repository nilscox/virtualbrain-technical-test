import { useState } from 'react';
import type { Pokemon } from 'shared';

interface CardProps {
  pokemon: Pokemon;
}

export const MiniCard: React.FC<CardProps> = ({ pokemon }) => {
  return (
    <div className="flex h-[40px] items-center rounded-2xl bg-amber-300 p-2">
      <img src={pokemon.image} alt={pokemon.name} style={{ height: '100%' }} />
      <div className="ml-2 text-center">{pokemon.name}</div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({ pokemon }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <div
      className={`w-[250px] rounded-2xl bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 p-1 shadow-md outline-orange-400 hover:outline-dashed`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transition: 'all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s',
      }}
    >
      <div className={`rounded-2xl bg-gradient-to-br from-black/10 via-white/70 to-black/10`}>
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
            className="my-3 bg-white outline outline-2 dark:bg-blue-950"
            src={pokemon.image}
            alt={pokemon.name}
            style={{ width: 'auto' }}
          />
          <div>Attack: {pokemon.stats.attack}</div>
          <div>Defense: {pokemon.stats.defense}</div>
          <div>Speed: {pokemon.stats.speed}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
