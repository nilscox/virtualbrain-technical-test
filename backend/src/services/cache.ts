import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { Pokemon } from 'shared';

import { fetchAllPokemons } from './pokeapi.ts';

const CACHE_PATH = join(import.meta.dirname, '../../cache.json');

/**
 * All pokemons, loaded at startup by `loadCache`
 */
export const CACHE: Pokemon[] = [];

/**
 * Populate the cache from the cache file, creating it from PokeAPI when it does not exist
 */
export async function loadCache(): Promise<void> {
  if (existsSync(CACHE_PATH)) {
    CACHE.push(...(JSON.parse(await readFile(CACHE_PATH, 'utf-8')) as Pokemon[]));
    return;
  }

  console.log('Pokemons cache not found, fetching all pokemons from PokeAPI...');

  const pokemons = await fetchAllPokemons();

  await writeFile(CACHE_PATH, JSON.stringify(pokemons, null, 2));

  console.log('Pokemons cache written to', CACHE_PATH);

  CACHE.push(...pokemons);
}
