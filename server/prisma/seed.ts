import process from "node:process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.car.deleteMany();

  const now = new Date();

  await prisma.car.createMany({
    data: [
      {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 28500,
        mileage: 15000,
        color: "Silver",
        status: "available",
        vin: "1HGBH41JXMN109186",
        description: "Well maintained vehicle with excellent fuel efficiency",
        imageUrl:
          "https://media.ed.edmunds-media.com/toyota/camry-hybrid/2021/oem/2021_toyota_camry-hybrid_sedan_xse_fq_oem_1_1600.jpg",
        createdAt: new Date(new Date(now).setMonth(now.getMonth() - 2)),
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2021,
        price: 22000,
        mileage: 25000,
        color: "Blue",
        status: "available",
        vin: "2HGBH41JXMN109187",
        description: "Reliable compact car perfect for daily commuting",
        imageUrl:
          "https://img.sm360.ca/images/inventory/lallier-honda-hull-gatineau/honda/civic/2021/36500280/36500280_05102_2021-honda-civic_025.JPG",
        createdAt: new Date(new Date(now).setMonth(now.getMonth() - 1)),
      },
      {
        make: "Ford",
        model: "F-150",
        year: 2023,
        price: 45000,
        mileage: 5000,
        color: "Black",
        status: "pending",
        vin: "3HGBH41JXMN109188",
        description:
          "Heavy-duty pickup truck with advanced towing capabilities",
        imageUrl:
          "https://vehicle-images.dealerinspire.com/1e2f-110010316/thumbnails/large/1FTEW1EP4MKD41394/b917d5e3c9d946d821d755daa7c646a2.jpg",
        createdAt: new Date(new Date(now).setDate(now.getDate() - 15)),
      },
      {
        make: "BMW",
        model: "320i",
        year: 2020,
        price: 35000,
        mileage: 30000,
        color: "White",
        status: "sold",
        vin: "4HGBH41JXMN109189",
        description:
          "Luxury sedan with premium features and smooth performance",
        imageUrl:
          "https://media.easierad.ie/eyJidWNrZXQiOiJlYXNpZXJhZC1pbWFnZXNlcnZlci1jYWNoZSIsImVkaXRzIjp7InRvRm9ybWF0IjoianBlZyIsInJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MTIwMCwiaGVpZ2h0Ijo5MDB9fSwia2V5IjoiNTExODk2LzI2MTA1ODI2LzI1MTc3NjExMC5qcGcifQ==?signature=78e829f9f2c294ae44c4f2ee9b3e952734b44b876460fb3a47490ebf2cae6055",
        createdAt: new Date(new Date(now).setMonth(now.getMonth() - 6)),
        soldAt: new Date(new Date(now).setMonth(now.getMonth() - 5)),
      },
    ],
  });
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
