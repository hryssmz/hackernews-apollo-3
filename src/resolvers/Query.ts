// resolvers/Query.ts
import prisma from "../utils/prisma";
import type { Link } from "@prisma/client";
import type { Feed, LinkOrderBy } from "../utils/types";

function info(): string {
  return "This is the API of a Hackernews Clone";
}

async function feed(
  _: unknown,
  args: { filter?: string; skip?: number; take?: number; orderBy?: LinkOrderBy }
): Promise<Feed> {
  const id = `main-feed:${JSON.stringify(args)}`;

  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const links = await prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = await prisma.link.count({ where });

  return { id, links, count };
}

async function link(_: unknown, args: Pick<Link, "id">): Promise<Link> {
  const link = await prisma.link.findUnique({ where: { id: args.id } });
  if (link === null) {
    throw new Error("No such link found");
  }
  return link;
}

const Query = { info, feed, link };

export default Query;
