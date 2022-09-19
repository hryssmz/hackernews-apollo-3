// resolvers/Query.ts
import prisma from "../utils/prisma";
import type { Link } from "@prisma/client";

function info(): string {
  return "This is the API of a Hackernews Clone";
}

async function feed(): Promise<Link[]> {
  const links = await prisma.link.findMany();
  return links;
}

async function link(_: unknown, args: Pick<Link, "id">): Promise<Link | null> {
  const link = prisma.link.findUnique({ where: { id: args.id } });
  return link;
}

const Query = { info, feed, link };

export default Query;
