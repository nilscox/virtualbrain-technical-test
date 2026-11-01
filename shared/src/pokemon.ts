export type PokemonType = {
  name: string;
  image: string;
};

export type StatBlock = {
  HP: number;
  attack: number;
  defense: number;
  speed: number;
};

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  stats: StatBlock;
  apiTypes: PokemonType[];
};
