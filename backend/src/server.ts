import { once } from 'events';
import { createServer, Server as NodeServer } from 'http';
import { promisify } from 'util';

import express from 'express';

import { ArenaController } from './controllers/arena-controller.ts';
import { ContentsController } from './controllers/contents-controller.ts';
import { PokemonController } from './controllers/pokemon-controller.ts';
import { errorHandler } from './middlewares/error-handler.ts';
import { PokeApi } from './services/pokeapi.ts';
import { PokemonDatabase } from './services/pokemon-database.ts';
import { VirtualBrainClient } from './services/virtualbrain.ts';

export class Server {
  private pokeApi = new PokeApi();
  private database = new PokemonDatabase(this.pokeApi);
  private virtualBrain = new VirtualBrainClient();

  private pokemonsController = new PokemonController(this.database);
  private contentsController = new ContentsController(this.database);
  private arenaController = new ArenaController(this.database, this.virtualBrain);

  private app = express();
  private httpServer?: NodeServer;

  async initialize() {
    await this.database.initialize();

    this.app.disable('x-powered-by');
    this.app.set('trust proxy', 1);

    this.app.use(express.json());

    this.app.use('/pokemons', this.pokemonsController.router);
    this.app.use('/contents', this.contentsController.router);
    this.app.use('/arena', this.arenaController.router);
    this.app.get('/ping', (_req, res) => res.status(200).send('pong'));

    this.app.use(errorHandler);
  }

  async listen(port: number) {
    this.httpServer = createServer(this.app).listen(port);
    await once(this.httpServer, 'listening');

    console.log('Server started on port:', port);
  }

  async close() {
    if (this.httpServer) {
      await promisify<void>((cb) => this.httpServer?.close(cb))();
    }
  }
}
