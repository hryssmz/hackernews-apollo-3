// resolvers/Vote.ts
import prisma from "../utils/prisma";
import type { Link, User, Vote } from "@prisma/client";

async function link(parent: Vote): Promise<Link | null> {
  const link = await prisma.vote
    .findUnique({ where: { id: parent.id } })
    .link();
  return link;
}

async function user(parent: Vote): Promise<User | null> {
  const user = await prisma.vote
    .findUnique({ where: { id: parent.id } })
    .user();
  return user;
}

const VoteResolver = { link, user };

export default VoteResolver;
