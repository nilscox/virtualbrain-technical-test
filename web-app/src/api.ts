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

/**
 * Start a battle between pokemons, the battle is streamed as markdown text
 */
export async function fetchBattle(pokemons: Pokemon[], signal: AbortSignal): Promise<ReadableStream<string>> {
  const response = await fetch(`${API_URL}/arena/battles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemonIds: pokemons.map(({ id }) => id) }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Battle request failed: ${response.status}`);
  }

  return response.body.pipeThrough(new TextDecoderStream());
}
