import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Meal } from '../../utils/interfaces/meal';
import { textToVector } from '../../llm';
import mealsCreatePrisma from '../../utils/db/meals/createMeals';
import mealDeletePrisma from '../../utils/db/meals/deleteMeal';
import mealGetPrisma from '../../utils/db/meals/getMeal';
import mealUpdatePrisma from '../../utils/db/meals/updateMeal';
import {
  createDocument,
  qdrant,
  COLLECTION_NAME,
  createQdrantCollection,
  syncData,
} from '../../utils/qdrant/vectorUtils';

const csvFilePath = path.join(__dirname, '..', 'static', 'meals.csv');

export const createMeal = async (req: Request, res: Response) => {
  const meal: Meal = req.body;
  try {
    const newMeal = (await mealsCreatePrisma(meal)) as Meal;
    const document = createDocument(newMeal);
    const vector = textToVector(document.pageContent);
    await qdrant.upsert(COLLECTION_NAME, [{ id: newMeal.id, vector, payload: { id: newMeal.id } }]);
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    await createQdrantCollection();
    const points = await syncData();
    res.status(200).json(points);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMealById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meal = await mealGetPrisma(+id);
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const meal: Meal = req.body;
  try {
    const updatedMeal = (await mealUpdatePrisma(+id, meal)) as Meal;
    const document = createDocument(updatedMeal);
    const vector = textToVector(document.pageContent);
    await qdrant.upsert(COLLECTION_NAME, [{ id: updatedMeal.id, vector, payload: { id: updatedMeal.id } }]);
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await mealDeletePrisma(+id);
    await qdrant.delete(COLLECTION_NAME, { ids: [parseInt(id, 10)] });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const readCSV = (req: Request, res: Response) => {
  const results: object[] = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data: object) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
};
