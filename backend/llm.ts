import OpenAI from 'openai';
import messageCreatePrisma from './utils/db/message/createMessage';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const callLlm = async (
  currentMessage: string,
  messages: { role: any; content: string }[],
  config: { model?: string; temperature?: number; response_format?: Object },
  systemMessage: string = 'You are a helpful assistant. Just answer a question and nothing more. Be strict and concise',
  conversationId: string
): Promise<any> => {
  const modelSettings: { model: string; temperature: number; response_format?: Object } = {
    model: config.model ?? 'gpt-4o',
    temperature: config.temperature ?? 0.7,
  };
  if (config.response_format) {
    modelSettings.response_format = config.response_format;
  }
  const allMesssges = [
    { role: 'system', content: systemMessage },
    ...messages,
    { role: 'user', content: currentMessage },
  ];
  const completion = await openai.chat.completions.create({
    messages: allMesssges,
    ...modelSettings,
  });

  const result = completion.choices[0].message.content || '';

  const createdMessage = messageCreatePrisma(conversationId, currentMessage, result, systemMessage);

  return result;
};


// Function to convert text data to vector embeddings
export async function textToVector(pageContent: string) {
  const settings = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: pageContent,
    }),
  };
  const openaiResponse = await fetch('https://api.openai.com/v1/embeddings', settings);

  const data = await openaiResponse.json();
  return data.data[0].embedding;
}
