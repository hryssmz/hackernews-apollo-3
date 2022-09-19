// utils/crypto.ts
import jwt from "jsonwebtoken";
import type { Request } from "express";
import type { User } from "@prisma/client";

export const APP_SECRET = "GraphQL-is-aw3some";

function getTokenPayload(token: string): { userId: User["id"] } {
  const result = jwt.verify(token, APP_SECRET) as { userId: User["id"] };
  return result;
}

export function getUserId(req: Request, authToken?: string): User["id"] {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}
