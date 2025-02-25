const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function seed() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Math" },
                { name: "Physics" },
                { name: "Chemistry" },
                { name: "Biology" },
                { name: "History" },
                { name: "English" },
                { name: "Spanish" },
                
            ],
        });

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();