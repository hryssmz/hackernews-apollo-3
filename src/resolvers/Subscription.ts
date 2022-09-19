// resolvers/Subscription.ts
import { pubsub } from "../utils/apollo";
import type { Link } from "@prisma/client";

const newLink = {
  subscribe: () => pubsub.asyncIterator("NEW_LINK"),
  resolve: (payload: Link) => payload,
};

const Subscription = { newLink };

export default Subscription;
