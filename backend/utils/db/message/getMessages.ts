import prisma from '../prisma';

export default async function messagesGetPrisma(conversation_id: string) {
  const messages = await prisma.message.findMany({
    where: { conversation_id },
  });
  return messages;
}
