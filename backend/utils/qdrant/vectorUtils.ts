import mealsGetAllPrisma from '../db/meals/getAllMeals';
import { fillReceipe } from '../../services/mealsService';
import { Meal } from '../interfaces/meal';
import { textToVector } from '../../llm';
import { VectorDocument } from '../interfaces/vectorDocuments';
import dotenv from 'dotenv';

dotenv.config();

// Create a Qdrant collection
const { QdrantClient } = require('@qdrant/qdrant-js');

export const COLLECTION_NAME = 'meal_list';

export const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

export async function createQdrantCollection() {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: 'Cosine' },
  });
}

// Synchronize data between PostgreSQL and Qdrant
export async function syncData() {
  let mealsItems = (await mealsGetAllPrisma()) as Meal[];

  mealsItems = (await fillReceipe(mealsItems)) as Meal[];

  let meals = mealsItems.map((item) => {
    return createDocument(item);
  });
  const points: any[] = [];

  for (const meal of meals) {
    const vector = await textToVector(meal.pageContent);

    points.push({
      id: meal.metadata.id,
      payload: meal.metadata,
      vector,
    });
    await qdrant.upsert(COLLECTION_NAME, {
      batch: {
        ids: points.map((point) => point.id),
        vectors: points.map((point) => point.vector),
        payloads: points.map((point) => point.payload),
      },
    });
  }
  return points;
}

export function createDocument(item: Meal) {
  const content = `${item.name} ${item.recipe} ${item.ingredients}`;
  const newDocument: VectorDocument = {
    pageContent: content,
    metadata: {
      id: item.id,
      name: item.name,
      recipe: item.recipe,
      ingredients: item.ingredients,
      source: COLLECTION_NAME,
    },
  };
  return newDocument;
}
