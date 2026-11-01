import assert from 'node:assert/strict';
import { afterEach, describe, mock, test } from 'node:test';
import { setTimeout } from 'node:timers/promises';

import axios from 'axios';

import { fetchAllPokemons } from './pokeapi.ts';

describe('fetchAllPokemons', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test('fetches the 898 pokemons in order', async () => {
    mockPokeApi(fakePokeApi('order'));

    const pokemons = await fetchAllPokemons();

    assert.equal(pokemons.length, 898);
    assert.deepEqual(
      pokemons.map(({ id }) => id),
      Array.from({ length: 898 }, (_, index) => index + 1),
    );
  });

  test('adapts PokeAPI data to the Pokemon shape', async () => {
    mockPokeApi(fakePokeApi('shape'));

    const [bulbasaur] = await fetchAllPokemons();

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

  test('fetches each type only once', async () => {
    const get = mockPokeApi(fakePokeApi('types'));

    await fetchAllPokemons();

    const typeCalls = get.mock.calls.filter((call) => call.arguments[0].includes('/type/'));

    assert.deepEqual(typeCalls.map((call) => call.arguments[0]).sort(), [
      typeUrl('types', 'grass'),
      typeUrl('types', 'poison'),
    ]);
  });

  test('fetches at most 10 pokemons at a time', async () => {
    const handler = fakePokeApi('concurrency');
    let inFlight = 0;
    let maxInFlight = 0;

    mockPokeApi(async (url) => {
      if (!url.includes('/pokemon/')) {
        return handler(url);
      }

      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await setTimeout(1);
      inFlight--;

      return handler(url);
    });

    await fetchAllPokemons();

    assert.equal(maxInFlight, 10);
  });

  test('rejects when PokeAPI fails', async () => {
    mockPokeApi(() => {
      throw new Error('PokeAPI is down');
    });

    await assert.rejects(fetchAllPokemons(), { message: 'PokeAPI is down' });
  });
});

/** Fake type urls are unique per test, as fetched types are cached for the module's lifetime */
const typeUrl = (testName: string, type: string) => `https://pokeapi.test/${testName}/type/${type}`;

const apiPokemon = (id: number, testName: string) => ({
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
    { slot: 2, type: { name: 'poison', url: typeUrl(testName, 'poison') } },
    { slot: 1, type: { name: 'grass', url: typeUrl(testName, 'grass') } },
  ],
});

const apiType = (name: string) => ({
  name,
  sprites: { 'generation-viii': { 'sword-shield': { name_icon: `${name}.png` } } },
});

const mockPokeApi = (handler: (url: string) => unknown) => {
  return mock.method(axios, 'get', async (url: string) => ({ data: await handler(url) }) as never);
};

const fakePokeApi = (testName: string) => (url: string) => {
  const pokemonId = url.match(/\/pokemon\/(\d+)$/)?.[1];

  if (pokemonId) {
    return apiPokemon(Number(pokemonId), testName);
  }

  return apiType(url.split('/').at(-1)!);
};
