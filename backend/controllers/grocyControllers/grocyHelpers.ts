import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export function getFetchSettings(method: 'GET' | 'POST', body?: any) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'GROCY-API-KEY': process.env.GROCY_API_KEY || '',
  };

  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
}

export async function fetchJson(url: string, settings: RequestInit) {
  const response = await fetch(url, settings);

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }

  return response.json();
}

export const handleError = (response: Response, error: any) => {
  console.error(error);
  response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
