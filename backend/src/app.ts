import { createServer } from 'http';

import express from 'express';

import { ArenaController } from './controllers/ArenaController.ts';
import { ContentController } from './controllers/ContentsController.ts';
import { PokemonController } from './controllers/PokemonController.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { loadCache } from './services/cache.ts';

await loadCache();

/** App */
const app = express();

app.disable('x-powered-by');
const httpServer = createServer(app);

app.set('trust proxy', 1);

/**
 * Body parser
 */
app.use(express.json());

/**
 * Routes
 */
app.use('/pokemons', PokemonController);
app.use('/contents', ContentController);
app.use('/arena', ArenaController);
app.get('/ping', (_req, res) => res.status(200).send('pong'));

app.use(errorHandler);

/* -------------------------- Start the application ------------------------- */

/**
 * Start server
 */
httpServer.listen(3001, () => {
  console.log('Server started on port:', 3001);
});
