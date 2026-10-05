import fastify from 'fastify';
import { PRODUCT_NAME } from '@fillin/shared';

const server = fastify();

server.get('/', async () => {
  return { hello: `Welcome to ${PRODUCT_NAME} Backend` };
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`${PRODUCT_NAME} backend listening on port 3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}
