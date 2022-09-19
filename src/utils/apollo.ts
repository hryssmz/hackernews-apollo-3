// utils/apollo.ts
import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { getUserId } from "../utils/crypto";
import Query from "../resolvers/Query";
import Mutation from "../resolvers/Mutation";
import UserResolver from "../resolvers/User";
import LinkResolver from "../resolvers/Link";
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

const resolvers: Config["resolvers"] = {
  Query,
  Mutation,
  User: UserResolver,
  Link: LinkResolver,
};

const typeDefs: Config["typeDefs"] = fs.readFileSync(
  path.join(__dirname, "..", "schema.graphql"),
  "utf8"
);

export async function startApolloServer(httpServer: Server) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  return server;
}
