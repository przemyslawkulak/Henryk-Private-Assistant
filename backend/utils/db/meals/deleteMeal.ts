import prisma from '../prisma';

export default async function mealDeletePrisma(id: number) {
  try {
    const meals = prisma.meal.delete({
      where: { id },
    });
    return meals;
  } catch (error) {
    return error;
  }
}
