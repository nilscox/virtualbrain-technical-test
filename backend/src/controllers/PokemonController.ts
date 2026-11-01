import { type Request, type Response, Router } from 'express';
import { fetchPokemon } from '../services/pokeapi.ts';

const PokemonController = Router();

PokemonController.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const pokemon = await fetchPokemon(id);

  return res.status(200).send({ pokemon });
});

export { PokemonController };
