import prisma from '../prisma';

export default async function messagesGetAllPrisma(take: number) {
  const messages = prisma.message.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take,
  });
  return messages;
}
