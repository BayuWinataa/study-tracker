import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'student1@ajarin.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'student1@ajarin.com',
      image: 'https://i.pravatar.cc/150?u=budi',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'student2@ajarin.com' },
    update: {},
    create: {
      name: 'Siti Aminah',
      email: 'student2@ajarin.com',
      image: 'https://i.pravatar.cc/150?u=siti',
    },
  });

  console.log('Seeding badges...');
  const badgesData = [
    { code: 'FIRST_CHECKIN', name: 'First Step', description: 'Completed your very first check-in.', icon: '🌱' },
    { code: 'STREAK_7', name: '7-Day Warrior', description: 'Maintained a study streak for 7 days.', icon: '🔥' },
    { code: 'STREAK_30', name: 'Monthly Master', description: 'Maintained a study streak for 30 days.', icon: '🏆' }
  ];

  for (const badge of badgesData) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: badge,
      create: badge,
    });
  }

  // Today WIB Date calculation
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const wibOffset = 7 * 60 * 60000;
  const wibDate = new Date(now.getTime() + utcOffset + wibOffset);
  wibDate.setHours(0, 0, 0, 0);

  const yesterday = new Date(wibDate);
  yesterday.setDate(yesterday.getDate() - 1);

  // Setup Check-ins and Streaks for User 1 (Active streak: 5)
  await prisma.streak.upsert({
    where: { userId: user1.id },
    update: { currentStreak: 5, longestStreak: 10, lastCheckInDate: wibDate },
    create: { userId: user1.id, currentStreak: 5, longestStreak: 10, lastCheckInDate: wibDate },
  });

  for (let i = 0; i < 5; i++) {
    const d = new Date(wibDate);
    d.setDate(d.getDate() - i);
    await prisma.checkIn.upsert({
      where: { userId_date: { userId: user1.id, date: d } },
      update: {},
      create: { userId: user1.id, date: d },
    });
  }

  // Setup Points for User 1
  await prisma.pointsLog.createMany({
    data: [
      { userId: user1.id, source: 'CHECK_IN', points: 10, createdAt: wibDate },
      { userId: user1.id, source: 'CHECK_IN', points: 10, createdAt: yesterday },
      { userId: user1.id, source: 'QUIZ', points: 50, createdAt: wibDate },
    ],
  });

  // Setup Check-ins and Streaks for User 2 (Active streak: 2)
  await prisma.streak.upsert({
    where: { userId: user2.id },
    update: { currentStreak: 2, longestStreak: 2, lastCheckInDate: yesterday },
    create: { userId: user2.id, currentStreak: 2, longestStreak: 2, lastCheckInDate: yesterday },
  });

  for (let i = 1; i <= 2; i++) {
    const d = new Date(wibDate);
    d.setDate(d.getDate() - i);
    await prisma.checkIn.upsert({
      where: { userId_date: { userId: user2.id, date: d } },
      update: {},
      create: { userId: user2.id, date: d },
    });
  }

  // Setup Points for User 2
  await prisma.pointsLog.createMany({
    data: [
      { userId: user2.id, source: 'CHECK_IN', points: 10, createdAt: yesterday },
      { userId: user2.id, source: 'TUTORING_SESSION', points: 100, createdAt: yesterday },
    ],
  });

  console.log('Seeding finished.');
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
