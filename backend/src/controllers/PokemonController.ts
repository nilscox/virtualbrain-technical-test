import { type Request, type Response, Router } from 'express';

import { findPokemon, listPokemons } from '../services/cache.ts';

export const PokemonController = Router();

PokemonController.get('/', (_req: Request, res: Response) => {
  return res.status(200).send({ pokemons: listPokemons() });
});

PokemonController.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const pokemon = findPokemon(Number(req.params.id));

  if (!pokemon) {
    return res.sendStatus(404);
  }

  return res.status(200).send({ pokemon });
});
