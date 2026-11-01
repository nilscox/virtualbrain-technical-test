import { pipeline } from 'stream/promises';

import { type Request, type Response, Router } from 'express';
import { MAX_BATTLE_POKEMONS, type Pokemon } from 'shared';
import { z } from 'zod';

import { findPokemon } from '../services/cache.ts';
import { queryChatbot } from '../services/virtualbrain.ts';

export const ArenaController = Router();

const battleBodySchema = z.object({
  pokemonIds: z
    .array(z.int().positive())
    .min(2, 'A battle needs at least two pokemons')
    .max(MAX_BATTLE_POKEMONS, `A battle allows at most ${MAX_BATTLE_POKEMONS} pokemons`)
    .refine((ids) => new Set(ids).size === ids.length, 'A pokemon cannot fight itself'),
});

/**
 * Simulate a battle between pokemons, the result is streamed as plain text
 * @route POST /arena/battles
 * @group Arena
 * @param {number[]} pokemonIds.body.required - IDs of the pokemons fighting, at least two
 */
ArenaController.post('/battles', async (req: Request, res: Response) => {
  const { pokemonIds } = battleBodySchema.parse(req.body);
  const pokemons = pokemonIds.map(findPokemon);

  if (!pokemons.every((pokemon) => pokemon !== undefined)) {
    return res.status(404).send({ message: 'Pokemon not found' });
  }

  const stream = await queryChatbot(battlePrompt(pokemons));

  res.type('text/plain');

  await pipeline(stream, res);
});

function describePokemon({ name, apiTypes, stats }: Pokemon) {
  return (
    `- ${name} (${apiTypes.map((type) => type.name).join(', ')}): ` +
    `HP ${stats.HP}, attack ${stats.attack}, defense ${stats.defense}, speed ${stats.speed}`
  );
}

function battlePrompt(pokemons: Pokemon[]) {
  return [
    'Simulate a pokemon battle between these pokemons:',
    ...pokemons.map(describePokemon),
    '',
    'The fastest pokemon attacks first and type matchups matter.',
    'Describe the battle in a few short rounds, then announce the winner.',
  ].join('\n');
}
