import { faker } from "@faker-js/faker";
import { $Enums, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.person.deleteMany();
  await prisma.notification.deleteMany();

  const createds = await prisma.person.createManyAndReturn({
    data: generatePeople(30),
  });

  const personIds = createds.map((p) => p.id);

  await prisma.notification.createMany({
    data: generateNotifications(30, personIds),
  });
}

function generatePeople(count: number) {
  const generate = () => ({
    displayName: faker.internet.displayName(),
    avatarUrl: faker.image.avatarGitHub(),
  });

  return faker.helpers.multiple(generate, { count });
}

function generateNotifications(count: number, personIds: number[]) {
  const generate = () => {
    const isPlatformUpdate = faker.number.int({ min: 1, max: 10 }) < 3;

    if (isPlatformUpdate) {
      return {
        type: $Enums.NotificationType.PlatformUpdate,
      };
    }

    return {
      type: faker.helpers.arrayElement([
        $Enums.NotificationType.AccessGranted,
        $Enums.NotificationType.CommentTag,
        $Enums.NotificationType.JoinWorkspace,
      ]),
      comeFromPersonId: faker.helpers.arrayElement(personIds),
    };
  };

  return faker.helpers.multiple(generate, { count });
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
