import axios from 'axios';
import type { Pokemon } from 'shared';

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

/** Generations 1 to 8 */
const POKEMON_COUNT = 898;

const CONCURRENCY = 10;

/** Pokemons share a handful of types: fetch each of them only once */
const typesCache = new Map<string, Promise<ApiType>>();

/**
 * Fetch all pokemons from PokeAPI, a few at a time to avoid flooding it
 */
export async function fetchAllPokemons(): Promise<Pokemon[]> {
  const pokemons: Pokemon[] = [];
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < POKEMON_COUNT) {
      const index = nextIndex++;
      pokemons[index] = await fetchPokemon(index + 1);
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  return pokemons;
}

type NamedResource = {
  name: string;
  url: string;
};

type ApiPokemon = {
  id: number;
  name: string;
  sprites: {
    other: { 'official-artwork': { front_default: string | null } };
  };
  stats: { base_stat: number; stat: NamedResource }[];
  types: { slot: number; type: NamedResource }[];
};

type ApiType = {
  name: string;
  sprites: { 'generation-viii': { 'sword-shield': { name_icon: string | null } } };
};

const fetchType = (url: string): Promise<ApiType> => {
  let type = typesCache.get(url);

  if (!type) {
    type = axios.get<ApiType>(url).then((r) => r.data);
    typesCache.set(url, type);
  }

  return type;
};

const baseStat = (pokemon: ApiPokemon, name: string): number =>
  pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

/**
 * Fetch a pokemon from PokeAPI and adapt it to the `Pokemon` shape
 */
async function fetchPokemon(id: number): Promise<Pokemon> {
  const { data: pokemon } = await axios.get<ApiPokemon>(`${POKEAPI_URL}/pokemon/${id}`);

  const types = await Promise.all(
    [...pokemon.types].sort((a, b) => a.slot - b.slot).map(({ type }) => fetchType(type.url)),
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
