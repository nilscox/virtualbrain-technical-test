import type { Pokemon } from 'shared';

/** Proxied to the backend by vite */
const API_URL = '/api';

export async function fetchPokemons(): Promise<Pokemon[]> {
  const response = await fetch(`${API_URL}/pokemons`);

  if (!response.ok) {
    throw new Error(`Failed to fetch the pokemons: ${response.status}`);
  }

  return response.json();
}
