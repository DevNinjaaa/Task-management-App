require('dotenv').config();
import { pool } from './pool';
import http from 'http';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloExpress } from '@apollo/server/express4';

const app = express();
const typeArrays = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolver.js'));

const schema = makeExecutableSchema({
  typeDefs: typeArrays,
  resolvers: resolversArray,
});

const httpServer = http.createServer(app);

const apolloServer = new ApolloServer({ schema });
async function server() {
  await apolloServer.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    apolloExpress(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, () => resolve()));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
server();
