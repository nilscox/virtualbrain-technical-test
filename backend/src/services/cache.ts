import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { Pokemon } from 'shared';

import { fetchAllPokemons } from './pokeapi.ts';

const CACHE_PATH = join(import.meta.dirname, '../../cache.json');

/**
 * All pokemons by id, loaded at startup by `loadCache`
 */
const CACHE: Record<number, Pokemon> = {};

export function listPokemons(): Pokemon[] {
  return Object.values(CACHE);
}

export function findPokemon(pokemonId: number): Pokemon | undefined {
  return CACHE[pokemonId];
}

/**
 * Populate the cache from the cache file, creating it from PokeAPI when it does not exist
 */
export async function loadCache(): Promise<void> {
  if (existsSync(CACHE_PATH)) {
    fillCache(JSON.parse(await readFile(CACHE_PATH, 'utf-8')) as Pokemon[]);
    return;
  }

  console.log('Pokemons cache not found, fetching all pokemons from PokeAPI...');

  const pokemons = await fetchAllPokemons();

  await writeFile(CACHE_PATH, JSON.stringify(pokemons, null, 2));

  console.log('Pokemons cache written to', CACHE_PATH);

  fillCache(pokemons);
}

const fillCache = (pokemons: Pokemon[]) => {
  for (const pokemon of pokemons) {
    CACHE[pokemon.id] = pokemon;
  }
};
