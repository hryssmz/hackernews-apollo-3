// index.ts
import { createServer } from "http";
import app from "./app";
import { HOST, PORT, NODE_ENV } from "./utils/env";
import { startApolloServer } from "./utils/apollo";

const httpServer = createServer(app);

startApolloServer(httpServer)
  .then(server => {
    server.applyMiddleware({ app });
    httpServer.listen({ host: HOST, port: PORT }, () => {
      console.log(`${NODE_ENV} server running on ${HOST}:${PORT}`);
    });
  })
  .catch(console.error);
