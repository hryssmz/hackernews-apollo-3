// index.ts
import http from "http";
import app from "./app";
import { HOST, PORT, NODE_ENV } from "./utils/env";
import { startApolloServer } from "./utils/apollo";
import prisma from "./utils/prisma";

const httpServer = http.createServer(app);

startApolloServer(httpServer)
  .then(async server => {
    server.applyMiddleware({ app, path: "/graphql" });
    await new Promise<void>(resolve =>
      httpServer.listen({ host: HOST, port: PORT }, resolve)
    );
    console.log(`${NODE_ENV} server running on ${HOST}:${PORT}`);
  })
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
  });
