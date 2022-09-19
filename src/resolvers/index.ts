// resolvers/index.ts
import Query from "./Query";
import Mutation from "./Mutation";
import Subscription from "./Subscription";
import UserResolver from "./User";
import LinkResolver from "./Link";
import VoteResolver from "./Vote";
import type { Config } from "apollo-server-core";

const resolvers: Config["resolvers"] = {
  Query,
  Mutation,
  Subscription,
  User: UserResolver,
  Link: LinkResolver,
  Vote: VoteResolver,
};

export default resolvers;
