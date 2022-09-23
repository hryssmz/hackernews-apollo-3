// scripts/seed.ts
import prisma from "../utils/prisma";

async function main() {
  console.log("Start seeding...");
  await deleteData();
}

async function deleteData() {
  await prisma.vote.deleteMany();
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();
}

main();
