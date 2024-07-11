import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import bodyParser from 'body-parser';
import askRouter from './routes/ask';
import grocyRouter from './routes/grocy';
import mealsRouter from './routes/meals';
import conversationsRouter from './routes/conversations';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? '3000';
app.use(cors());

app.use((req, res, next) => {
  res.append('Access-Control-Expose-Headers', 'x-conversation-id');
  next();
});

app.use(bodyParser.json());

app.use('/api/ask', askRouter);

app.use('/api/grocy', grocyRouter);

app.use('/api/meals', mealsRouter);

app.use('/api/conversations', conversationsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
