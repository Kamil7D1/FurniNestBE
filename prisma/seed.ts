import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const customerData: Prisma.CustomerCreateInput[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    password: "",
  },
  {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jankowalski@gmail.com",
    password: "",
  },
];

async function main() {
  console.log(`Start seeding...`);

  await prisma.customer.deleteMany({});

  const hashedPassword = await hashPassword("password123!");

  for (const c of customerData) {
    const customer = await prisma.customer.create({
      data: {
        ...c,
        password: hashedPassword,
      },
    });
    console.log(`Created customer with id: ${customer.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
