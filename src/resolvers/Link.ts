// resolvers/Link.ts
import prisma from "../utils/prisma";
import type { Link, User, Vote } from "@prisma/client";

async function postedBy(parent: Link): Promise<User | null> {
  const user = await prisma.link
    .findUnique({
      where: { id: parent.id },
    })
    .postedBy();
  return user;
}

async function votes(parent: Link): Promise<Vote[]> {
  const votes = await prisma.link
    .findUnique({ where: { id: parent.id } })
    .votes();
  return votes;
}

const LinkResolver = { postedBy, votes };

export default LinkResolver;
