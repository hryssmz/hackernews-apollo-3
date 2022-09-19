// resolvers/Mutation.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { APP_SECRET } from "../utils/crypto";
import type { Link, User } from "@prisma/client";
import type { Context } from "../utils/apollo";

async function signup(
  _: unknown,
  args: Pick<User, "name" | "email" | "password">
): Promise<{ token: string; user: User }> {
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
): Promise<{ token: string; user: User }> {
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
  return newLink;
}

async function updateLink(
  _: unknown,
  args: Partial<Pick<Link, "description" | "url">> & Pick<Link, "id">,
  context: Context
): Promise<Link | null> {
  const link = await prisma.link.findUnique({
    where: { id: args.id },
  });
  if (link === null) {
    return null;
  }
  if (link.postedById !== context.userId) {
    return null;
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
): Promise<Link | null> {
  const link = await prisma.link.findUnique({
    where: { id: args.id },
  });
  if (link === null) {
    return null;
  }
  if (link.postedById !== context.userId) {
    return null;
  }
  await prisma.link.delete({ where: { id: link.id } });
  return link;
}

const Mutation = { signup, login, post, updateLink, deleteLink };

export default Mutation;
