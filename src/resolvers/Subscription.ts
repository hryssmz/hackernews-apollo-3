// resolvers/Subscription.ts
import { pubsub } from "../utils/apollo";
import type { Link, Vote } from "@prisma/client";

const newLink = {
  subscribe: () => pubsub.asyncIterator("NEW_LINK"),
  resolve: (payload: Link) => payload,
};

const newVote = {
  subscribe: () => pubsub.asyncIterator("NEW_VOTE"),
  resolve: (payload: Vote) => payload,
};

const Subscription = { newLink, newVote };

export default Subscription;
