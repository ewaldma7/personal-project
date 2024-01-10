const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    for (let i = 0; i < 10; i++) {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const email = faker.internet.email({firstName: first, lastName: last});
      const password = "Testing123!"; // Generate a random password
      const location = faker.location.country();
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name: `${first} ${last}`,
          email,
          password_hash: hashedPassword,
          location
        },
      });
    }
    
    console.log('Migration script executed successfully.');
  } catch (error) {
    console.error('Error executing migration script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
