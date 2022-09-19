// resolvers/Link.ts
import prisma from "../utils/prisma";
import type { Link, User } from "@prisma/client";

async function postedBy(parent: Link): Promise<User | null> {
  const user = await prisma.link
    .findUnique({
      where: { id: parent.id },
    })
    .postedBy();
  return user;
}

const LinkResolver = { postedBy };

export default LinkResolver;
