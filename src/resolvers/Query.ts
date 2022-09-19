// resolvers/Query.ts
import prisma from "../utils/prisma";
import type { Link, Prisma } from "@prisma/client";

function info(): string {
  return "This is the API of a Hackernews Clone";
}

interface LinkOrderBy {
  description?: Prisma.SortOrder;
  url?: Prisma.SortOrder;
  createdAt?: Prisma.SortOrder;
}

interface Feed {
  links: Link[];
  count: number;
}

async function feed(
  _: unknown,
  args: { filter?: string; skip?: number; take?: number; orderBy?: LinkOrderBy }
): Promise<Feed> {
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

  return { links, count };
}

async function link(_: unknown, args: Pick<Link, "id">): Promise<Link | null> {
  const link = prisma.link.findUnique({ where: { id: args.id } });
  return link;
}

const Query = { info, feed, link };

export default Query;
