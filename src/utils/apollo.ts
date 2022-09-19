// utils/apollo.ts
import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { getUserId } from "../utils/crypto";
import resolvers from "../resolvers";
import type { Server } from "http";
import type { Config } from "apollo-server-core";
import type { Request } from "express";
import type { User } from "@prisma/client";

export interface Context extends Partial<Request> {
  userId: User["id"] | null;
}

const context: (options: { req?: Request }) => Context = ({ req }) => ({
  ...req,
  userId: req && req.headers.authorization ? getUserId(req) : null,
});

const typeDefs: Config["typeDefs"] = fs.readFileSync(
  path.join(__dirname, "..", "schema.graphql"),
  "utf8"
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const pubsub = new PubSub();

export async function startApolloServer(httpServer: Server) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  return server;
}
