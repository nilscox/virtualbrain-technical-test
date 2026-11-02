import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test, type Mock } from 'node:test';

import { PokeApi } from './pokeapi.ts';

void describe('fetchAllPokemons', () => {
  let fetch: Mock<typeof globalThis.fetch>;
  let pokeApi: PokeApi;

  beforeEach(() => {
    fetch = mock.fn(mockPokeApi);
    pokeApi = new PokeApi(fetch);
  });

  void test('fetches the 898 pokemons in order', async () => {
    const pokemons = await pokeApi.fetchAllPokemons();

    assert.equal(pokemons.length, 898);
    assert.deepEqual(
      pokemons.map(({ id }) => id),
      Array.from({ length: 898 }, (_, index) => index + 1),
    );
  });

  void test('adapts PokeAPI data to the Pokemon shape', async () => {
    const [bulbasaur] = await pokeApi.fetchAllPokemons();

    assert.deepEqual(bulbasaur, {
      id: 1,
      name: 'pokemon-1',
      image: 'artwork-1.png',
      stats: { HP: 1, attack: 2, defense: 3, speed: 6 },
      apiTypes: [
        { name: 'grass', image: 'grass.png' },
        { name: 'poison', image: 'poison.png' },
      ],
    });
  });

  void test('fetches each type only once', async () => {
    await pokeApi.fetchAllPokemons();

    const typeCalls = fetch.mock.calls.filter((call) => (call.arguments[0] as string).includes('/type/'));

    // oxlint-disable-next-line typescript/require-array-sort-compare
    assert.deepEqual(typeCalls.map((call) => call.arguments[0]).sort(), [
      typeUrl('grass'),
      typeUrl('poison'),
    ]);
  });

  void test('rejects when PokeAPI fails', async () => {
    fetch.mock.mockImplementation(() => {
      throw new Error('PokeAPI is down');
    });

    await assert.rejects(pokeApi.fetchAllPokemons(), { message: 'PokeAPI is down' });
  });
});

async function mockPokeApi(url: URL | RequestInfo) {
  assert(typeof url === 'string');

  const handle = () => {
    const pokemonId = url.match(/\/pokemon\/(\d+)$/)?.[1];

    if (pokemonId) {
      return apiPokemon(Number(pokemonId));
    }

    return apiType(url.split('/').at(-1)!);
  };

  return new Response(JSON.stringify(handle()));
}

function typeUrl(type: string) {
  return `https://pokeapi.test/type/${type}`;
}

function apiPokemon(id: number) {
  return {
    id,
    name: `pokemon-${id}`,
    sprites: { other: { 'official-artwork': { front_default: `artwork-${id}.png` } } },
    stats: [
      { base_stat: 1, stat: { name: 'hp', url: '' } },
      { base_stat: 2, stat: { name: 'attack', url: '' } },
      { base_stat: 3, stat: { name: 'defense', url: '' } },
      { base_stat: 4, stat: { name: 'special-attack', url: '' } },
      { base_stat: 5, stat: { name: 'special-defense', url: '' } },
      { base_stat: 6, stat: { name: 'speed', url: '' } },
    ],
    types: [
      { slot: 2, type: { name: 'poison', url: typeUrl('poison') } },
      { slot: 1, type: { name: 'grass', url: typeUrl('grass') } },
    ],
  };
}

function apiType(name: string) {
  return {
    name,
    sprites: { 'generation-viii': { 'sword-shield': { name_icon: `${name}.png` } } },
  };
}
