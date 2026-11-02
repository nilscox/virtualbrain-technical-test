import type { Pokemon } from 'shared';

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

export class PokeApi {
  private readonly pokeApiUrl = 'https://pokeapi.co/api/v2';
  /** Generations 1 to 8 */
  private readonly pokemonCount = 898;
  private readonly fetchConcurrency = 10;
  /** Pokemons share a handful of types: fetch each of them only once */
  private readonly typesCache = new Map<string, Promise<ApiType>>();

  private fetch: typeof globalThis.fetch;

  constructor(fetch = globalThis.fetch) {
    this.fetch = fetch;
  }

  /**
   * Fetch all pokemons from PokeAPI, a few at a time to avoid flooding it
   */
  async fetchAllPokemons(): Promise<Pokemon[]> {
    const pokemons: Pokemon[] = [];
    let nextIndex = 0;

    const worker = async () => {
      while (nextIndex < this.pokemonCount) {
        const index = nextIndex++;
        pokemons[index] = await this.fetchPokemon(index + 1);
      }
    };

    await Promise.all(Array.from({ length: this.fetchConcurrency }, worker));

    return pokemons;
  }

  private fetchType(url: string): Promise<ApiType> {
    let type = this.typesCache.get(url);

    if (!type) {
      type = this.get<ApiType>(url);
      this.typesCache.set(url, type);
    }

    return type;
  }

  private static baseStat(pokemon: ApiPokemon, name: string): number {
    return pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
  }

  private async fetchPokemon(id: number): Promise<Pokemon> {
    const pokemon = await this.get<ApiPokemon>(`${this.pokeApiUrl}/pokemon/${id}`);

    const types = await Promise.all(
      [...pokemon.types].sort((a, b) => a.slot - b.slot).map(({ type }) => this.fetchType(type.url)),
    );

    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other['official-artwork'].front_default ?? '',
      stats: {
        HP: PokeApi.baseStat(pokemon, 'hp'),
        attack: PokeApi.baseStat(pokemon, 'attack'),
        defense: PokeApi.baseStat(pokemon, 'defense'),
        speed: PokeApi.baseStat(pokemon, 'speed'),
      },
      apiTypes: types.map((type) => ({
        name: type.name,
        image: type.sprites['generation-viii']['sword-shield'].name_icon ?? '',
      })),
    };
  }

  private async get<T>(url: string): Promise<T> {
    const response = await this.fetch(url);

    if (!response.ok) {
      throw new Error(`PokeAPI request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
