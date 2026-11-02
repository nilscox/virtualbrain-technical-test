import { Router, type Request, type Response } from 'express';

import type { PokemonDatabase } from '../services/pokemon-database.ts';

export class PokemonController {
  private readonly database: PokemonDatabase;
  readonly router = Router();

  constructor(database: PokemonDatabase) {
    this.database = database;

    this.router.get('/', this.listPokemons);
    this.router.get('/:id', this.getPokemon);
  }

  private listPokemons = (req: Request, res: Response) => {
    res.status(200).json(this.database.listPokemons());
  };

  private getPokemon = (req: Request<{ id: string }>, res: Response) => {
    const pokemon = this.database.findPokemon(Number(req.params.id));

    if (!pokemon) {
      res.sendStatus(404);
    } else {
      res.status(200).json(pokemon);
    }
  };
}
