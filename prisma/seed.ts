// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing data to make the script idempotent
  await prisma.userWatchlist.deleteMany();
  await prisma.socialMention.deleteMany();
  await prisma.iPO.deleteMany();
  await prisma.sECFiling.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create a sample company
  const company = await prisma.company.create({
    data: {
      name: "QuantumLeap AI",
      ticker: "QLAI",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Artificial Intelligence",
      description:
        "QuantumLeap AI is a leading innovator in generative AI models for the financial sector.",
      website: "https://www.quantumleap-ai.dev",
    },
  });

  console.log(`Created company: ${company.name}`);

  // Create a sample IPO for that company
  const ipo = await prisma.iPO.create({
    data: {
      companyId: company.id,
      status: "FILED",
      filingDate: new Date("2025-05-15T00:00:00Z"),
      expectedDate: new Date("2025-07-20T00:00:00Z"),
      sharesOffered: 50000000,
      priceRangeLow: 22.0,
      priceRangeHigh: 25.0,
    },
  });

  console.log(`Created IPO for ${company.name} with status ${ipo.status}`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
