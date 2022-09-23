// utils/types.ts
import type { Link, Prisma, User } from "@prisma/client";

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LinkOrderBy {
  description?: Prisma.SortOrder;
  url?: Prisma.SortOrder;
  createdAt?: Prisma.SortOrder;
}

export interface Feed {
  id: string;
  links: Link[];
  count: number;
}
