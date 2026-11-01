import { type Request, type Response, Router } from 'express';

import { CACHE } from '../services/cache.ts';

const PokemonController = Router();

PokemonController.get('/', (_req: Request, res: Response) => {
  return res.status(200).send({ pokemons: CACHE });
});

PokemonController.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const pokemon = CACHE.find(({ id }) => id === Number(req.params.id));

  if (!pokemon) {
    return res.sendStatus(404);
  }

  return res.status(200).send({ pokemon });
});

export { PokemonController };
