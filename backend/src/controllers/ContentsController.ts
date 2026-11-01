import { type Request, type Response, Router } from 'express';

import { findPokemon } from '../services/cache.ts';
import { pokemonToMarkdown } from '../services/markdown.ts';

export const ContentController = Router();

/**
 * Save all pokemon as markdown in markdown folder
 * @route GET /contents/all
 * @group Contents
 */
ContentController.get('/all', async (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

/**
 * Return a pokemon as markdown
 * @route GET /contents/:pokemonId
 * @group Contents
 * @param {string} pokemonId.path.required - Pokemon ID
 */
ContentController.get('/:pokemonId', (req: Request<{ pokemonId: string }>, res: Response) => {
  const pokemon = findPokemon(Number(req.params.pokemonId));

  if (!pokemon) {
    return res.sendStatus(404);
  }

  res.attachment(`${pokemon.name}.md`);
  res.type('text/markdown');

  return res.status(200).send(pokemonToMarkdown(pokemon));
});
