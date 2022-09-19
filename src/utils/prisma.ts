// utils/prisma.ts
import { PrismaClient } from "@prisma/client";

console.log("Creating a new Prisma instance...");
const prisma = new PrismaClient();

export default prisma;
