import prisma from '../prisma';

export default async function mealsGetPrisma(conditions: { [key: string]: boolean | { [key: string]: Date } }) {
  try {
    const meals = await prisma.meal.findMany({
      where: conditions,
    });
    return meals;
  } catch (error) {
    return error;
  }
}
