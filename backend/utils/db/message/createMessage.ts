import prisma from '../prisma';

export default async function messageCreatePrisma(
  conversationId: string,
  humanMessage?: string,
  aiMessage?: string,
  systemMessage?: string,
) {
  try {
    const message = await prisma.message.create({
      data: {
        conversation_id: conversationId,
        human: humanMessage,
        ai: aiMessage,
        system: systemMessage,
      },
    });
    return message;
  } catch (error) {
    return error;
  }
}
