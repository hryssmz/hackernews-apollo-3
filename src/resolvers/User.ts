// resolvers/User.ts
import prisma from "../utils/prisma";
import type { Link, User } from "@prisma/client";

async function links(parent: User): Promise<Link[]> {
  const links = await prisma.user
    .findUnique({ where: { id: parent.id } })
    .links();
  return links;
}

const UserResolver = { links };

export default UserResolver;
