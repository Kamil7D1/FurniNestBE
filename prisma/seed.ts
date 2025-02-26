import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

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

const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Wooden Dining Table",
    price: new Prisma.Decimal(299.99),
    currency: "USD",
    description:
      "A solid wooden dining table with 4 seats, perfect for any dining room.",
    stockQuantity: 20,
    imageUrl: "https://example.com/wooden-dining-table.jpg",
    deliveryTime: "10 working days",
    height: new Prisma.Decimal(75.0),
    width: new Prisma.Decimal(160.0),
    depth: new Prisma.Decimal(90.0),
    category: "Dining",
  },
  {
    name: "Ergonomic Office Chair",
    price: new Prisma.Decimal(149.99),
    currency: "USD",
    description:
      "Comfortable ergonomic office chair with lumbar support and adjustable arms.",
    stockQuantity: 50,
    imageUrl: "https://example.com/office-chair.jpg",
    deliveryTime: "5 working days",
    height: new Prisma.Decimal(120.0),
    width: new Prisma.Decimal(60.0),
    depth: new Prisma.Decimal(60.0),
    category: "Office",
  },
  {
    name: "King Size Bed",
    price: new Prisma.Decimal(799.99),
    currency: "USD",
    description:
      "Spacious king size bed with a high-quality memory foam mattress.",
    stockQuantity: 15,
    imageUrl: "https://example.com/king-bed.jpg",
    deliveryTime: "15 working days",
    height: new Prisma.Decimal(45.0),
    width: new Prisma.Decimal(200.0),
    depth: new Prisma.Decimal(210.0),
    category: "Bedroom",
  },
  {
    name: "Modern Sofa",
    price: new Prisma.Decimal(599.99),
    currency: "USD",
    description:
      "A modern sofa with soft fabric upholstery, ideal for living rooms.",
    stockQuantity: 30,
    imageUrl: "https://example.com/modern-sofa.jpg",
    deliveryTime: "7 working days",
    height: new Prisma.Decimal(80.0),
    width: new Prisma.Decimal(200.0),
    depth: new Prisma.Decimal(90.0),
    category: "Living Room",
  },
  {
    name: "Wooden Bookshelf",
    price: new Prisma.Decimal(120.0),
    currency: "USD",
    description:
      "A sturdy wooden bookshelf that fits any home office or living room.",
    stockQuantity: 40,
    imageUrl: "https://example.com/wooden-bookshelf.jpg",
    deliveryTime: "7 working days",
    height: new Prisma.Decimal(180.0),
    width: new Prisma.Decimal(80.0),
    depth: new Prisma.Decimal(30.0),
    category: "Office",
  },
  {
    name: "Glass Coffee Table",
    price: new Prisma.Decimal(180.0),
    currency: "USD",
    description: "A sleek glass coffee table with a metal frame.",
    stockQuantity: 25,
    imageUrl: "https://example.com/glass-coffee-table.jpg",
    deliveryTime: "5 working days",
    height: new Prisma.Decimal(40.0),
    width: new Prisma.Decimal(100.0),
    depth: new Prisma.Decimal(60.0),
    category: "Living Room",
  },
];

async function main() {
  console.log(`Start seeding...`);

  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});

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

  for (const p of productData) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
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
