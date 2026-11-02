import { Router, type Request, type Response } from 'express';
import { createTarGzip } from 'nanotar';
import type { Pokemon } from 'shared';

import { Markdown } from '../services/markdown.ts';
import type { PokemonDatabase } from '../services/pokemon-database.ts';

export class ContentsController {
  /** Named after the folder imported in the brain */
  private readonly exportDirectory = 'pokemons-ru';
  private readonly database: PokemonDatabase;

  readonly router = Router();

  constructor(database: PokemonDatabase) {
    this.database = database;

    this.router.get('/all', this.getAll);
    this.router.get('/:pokemonId', this.getPokemon);
  }

  /**
   * Return all pokemons as markdown files, in a .tar.gz archive
   * @route GET /contents/all
   * @group Contents
   */
  private getAll = async (_req: Request, res: Response) => {
    const archive = await this.createArchive();

    res.attachment(`${this.exportDirectory}.tar.gz`);

    return res.status(200).send(Buffer.from(archive));
  };

  /**
   * Return a pokemon as markdown
   * @route GET /contents/:pokemonId
   * @group Contents
   * @param {string} pokemonId.path.required - Pokemon ID
   */
  private getPokemon = (req: Request<{ pokemonId: string }>, res: Response) => {
    const pokemon = this.database.findPokemon(Number(req.params.pokemonId));

    if (!pokemon) {
      return res.sendStatus(404);
    }

    res.attachment(this.markdownFileName(pokemon));
    res.type('text/markdown');

    return res.status(200).send(Markdown.pokemonToMarkdown(pokemon));
  };

  private markdownFileName(pokemon: Pokemon) {
    return `${pokemon.name}.md`;
  }

  private createArchive() {
    return createTarGzip(
      this.database.listPokemons().map((pokemon) => ({
        name: `${this.exportDirectory}/${this.markdownFileName(pokemon)}`,
        data: Markdown.pokemonToMarkdown(pokemon),
      })),
    );
  }
}
