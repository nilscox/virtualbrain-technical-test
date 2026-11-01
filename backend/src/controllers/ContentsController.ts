import { type Request, type Response, Router } from 'express';
import { createTarGzip } from 'nanotar';
import type { Pokemon } from 'shared';

import { findPokemon, listPokemons } from '../services/cache.ts';
import { pokemonToMarkdown } from '../services/markdown.ts';

/** Named after the folder imported in the brain */
const EXPORT_DIRECTORY = 'pokemons-ru';

export const ContentController = Router();

/**
 * Return all pokemons as markdown files, in a .tar.gz archive
 * @route GET /contents/all
 * @group Contents
 */
ContentController.get('/all', async (_req: Request, res: Response) => {
  const archive = await createTarGzip(
    listPokemons().map((pokemon) => ({
      name: `${EXPORT_DIRECTORY}/${markdownFileName(pokemon)}`,
      data: pokemonToMarkdown(pokemon),
    })),
  );

  res.attachment(`${EXPORT_DIRECTORY}.tar.gz`);

  return res.status(200).send(Buffer.from(archive));
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

  res.attachment(markdownFileName(pokemon));
  res.type('text/markdown');

  return res.status(200).send(pokemonToMarkdown(pokemon));
});

function markdownFileName(pokemon: Pokemon) {
  return `${pokemon.name}.md`;
}
