import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { Pokemon } from 'shared';

import { PokeApi } from './pokeapi.ts';

export class PokemonDatabase {
  private readonly pokeApi: PokeApi;

  private readonly cachePath = join(import.meta.dirname, '../../cache.json');
  /** All pokemons by id, loaded at startup by `initialize` */
  private readonly pokemons: Record<number, Pokemon> = {};

  constructor(pokeApi: PokeApi) {
    this.pokeApi = pokeApi;
  }

  listPokemons(): Pokemon[] {
    return Object.values(this.pokemons);
  }

  findPokemon(pokemonId: number): Pokemon | undefined {
    return this.pokemons[pokemonId];
  }

  /**
   * Populate the database from the cache file, creating it from PokeAPI when it does not exist
   */
  async initialize(): Promise<void> {
    if (existsSync(this.cachePath)) {
      this.fill(JSON.parse(await readFile(this.cachePath, 'utf-8')) as Pokemon[]);
      return;
    }

    console.log('Pokemons cache not found, fetching all pokemons from PokeAPI...');

    const pokemons = await this.pokeApi.fetchAllPokemons();

    await writeFile(this.cachePath, JSON.stringify(pokemons, null, 2));
    this.fill(pokemons);

    console.log('Pokemons cache written to', this.cachePath);
  }

  private fill(pokemons: Pokemon[]) {
    for (const pokemon of pokemons) {
      this.pokemons[pokemon.id] = pokemon;
    }
  }
}
