import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@binakata.com' },
    update: {},
    create: {
      email: 'test@binakata.com',
      passwordHash: 'hashed_password_here', // In real app, properly hash this
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create test child
  const testChild = await prisma.child.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      parentId: testUser.id,
      name: 'Ahmad',
      age: 7,
    },
  });

  console.log('✅ Created test child:', testChild.name);

  // Create another test child
  const testChild2 = await prisma.child.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      parentId: testUser.id,
      name: 'Siti',
      age: 8,
    },
  });

  console.log('✅ Created test child 2:', testChild2.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });