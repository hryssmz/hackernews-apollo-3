// resolvers/Mutation.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pubsub } from "../utils/apollo";
import prisma from "../utils/prisma";
import { APP_SECRET } from "../utils/crypto";
import type { Link, User, Vote } from "@prisma/client";
import type { Context } from "../utils/apollo";
import type { AuthPayload } from "../utils/types";

async function signup(
  _: unknown,
  args: Pick<User, "name" | "email" | "password">
): Promise<AuthPayload> {
  const password = await bcrypt.hash(args.password, 10);
  const user = await prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function login(
  _: unknown,
  args: Pick<User, "email" | "password">
): Promise<AuthPayload> {
  const user = await prisma.user.findUnique({
    where: { email: args.email },
  });
  if (user === null) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function post(
  _: unknown,
  args: Pick<Link, "url" | "description">,
  context: Context
): Promise<Link> {
  const { userId } = context;
  const newLink = await prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: userId !== null ? { connect: { id: userId } } : undefined,
    },
  });
  pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function updateLink(
  _: unknown,
  args: Partial<Pick<Link, "description" | "url">> & Pick<Link, "id">,
  context: Context
): Promise<Link> {
  const link = await prisma.link.findUnique({
    where: { id: args.id },
  });
  if (link === null) {
    throw new Error("No such link found");
  }
  if (link.postedById !== context.userId) {
    throw new Error("You have no permission");
  }
  const newLink = await prisma.link.update({
    where: { id: args.id },
    data: { description: args.description, url: args.url },
  });
  return newLink;
}

async function deleteLink(
  _: unknown,
  args: Pick<Link, "id">,
  context: Context
): Promise<Link> {
  const link = await prisma.link.findUnique({
    where: { id: args.id },
  });
  if (link === null) {
    throw new Error("No such link found");
  }
  if (link.postedById !== context.userId) {
    throw new Error("You have no permission");
  }
  await prisma.link.delete({ where: { id: link.id } });
  return link;
}

async function vote(
  _: unknown,
  args: Pick<Vote, "linkId">,
  context: Context
): Promise<Vote | null> {
  const { userId } = context;
  if (userId === null) {
    return null;
  }

  const vote = await prisma.vote.findUnique({
    where: {
      linkId_userId: { linkId: args.linkId, userId },
    },
  });
  if (vote !== null) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: args.linkId } },
    },
  });
  pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

const Mutation = { signup, login, post, updateLink, deleteLink, vote };

export default Mutation;
