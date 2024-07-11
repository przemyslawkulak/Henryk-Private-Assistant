import { Request, Response } from 'express';
import messagesGetAllPrisma from '../../utils/db/message/getAllMessages';

export const getConversationsData = async (req: Request, res: Response) => {
  const { take } = req.params;

  try {
    const conversations = await messagesGetAllPrisma(+take);
    if (!conversations) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
};
