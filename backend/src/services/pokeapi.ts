import axios from 'axios';
import type { Pokemon } from 'shared';

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

interface NamedResource {
  name: string;
  url: string;
}

interface ApiPokemon {
  id: number;
  name: string;
  sprites: {
    other: { 'official-artwork': { front_default: string | null } };
  };
  stats: { base_stat: number; stat: NamedResource }[];
  types: { slot: number; type: NamedResource }[];
}

interface ApiType {
  name: string;
  sprites: { 'generation-viii': { 'sword-shield': { name_icon: string | null } } };
}

const baseStat = (pokemon: ApiPokemon, name: string): number =>
  pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

/**
 * Fetch a pokemon from PokeAPI and adapt it to the `Pokemon` shape
 */
export async function fetchPokemon(id: string): Promise<Pokemon> {
  const { data: pokemon } = await axios.get<ApiPokemon>(`${POKEAPI_URL}/pokemon/${id}`);

  const types = await Promise.all(
    [...pokemon.types]
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) => axios.get<ApiType>(type.url).then((r) => r.data)),
  );

  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default ?? '',
    stats: {
      HP: baseStat(pokemon, 'hp'),
      attack: baseStat(pokemon, 'attack'),
      defense: baseStat(pokemon, 'defense'),
      speed: baseStat(pokemon, 'speed'),
    },
    apiTypes: types.map((type) => ({
      name: type.name,
      image: type.sprites['generation-viii']['sword-shield'].name_icon ?? '',
    })),
  };
}
