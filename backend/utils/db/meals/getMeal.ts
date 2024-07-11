import prisma from '../prisma';

export default async function mealGetPrisma(id: number) {
  try {
    const meals = await prisma.meal.findUnique({
      where: { id: id },
    })
    return meals;
  } catch (error) {
    return error;
  }
}
