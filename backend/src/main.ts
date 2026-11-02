import { Server } from './server.ts';

async function main() {
  const server = new Server();

  await server.initialize();
  await server.listen(Number(process.env.PORT ?? '3001'));

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close().catch(console.error));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
