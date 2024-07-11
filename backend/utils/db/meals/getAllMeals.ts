import { Meal } from '../../interfaces/meal';
import prisma from '../prisma';

export default async function mealsGetAllPrisma() {
  try {
    const meals = (await prisma.meal.findMany()) as Meal[];
    return meals;
  } catch (error) {
    return error;
  }
}
