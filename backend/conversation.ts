import messagesGetPrisma from './utils/db/message/getMessages';

export const currentConversation = async (conversationId: string) => {
  try {
    const messages = await messagesGetPrisma(conversationId);

    if (!messages.length) {
      console.log('no messages');
      return [];
    }
    console.log('conversation found');

    return messages
      .map((message: any) => {
        return [
          { role: 'user', content: message.human },
          { role: 'assistant', content: message.ai },
        ];
      })
      .flat();
  } catch (e) {
    console.info('Database not initialized. Moving on...');
    return [];
  }
};

