import { callLlm } from '../llm';
import { findRecipe } from '../prompt';
import mealsCreatePrisma from '../utils/db/meals/createMeals';
import { Meal } from '../utils/interfaces/meal';
import dotenv from 'dotenv';

dotenv.config();

export const addMealsFromCSV = async () => {
  const mealsResponse = await fetch(`${process.env.API_URL}/meals/read-csv`, {
    method: 'GET',
  });
  const meals = await mealsResponse.json();

  for (const element of meals) {
    const meal: Meal = {
      name: element.Name,
      lastUsed: element.Date ? new Date(element.Date) : undefined,
      created: new Date(),
      dinner: !!element.Lunch,
      supper: !!element.Dinner,
      pasta: !!element.Pasta,
      groats: !!element.Groats,
      rice: !!element.Rice,
      potatoes: !!element.Potatoes,
      legumes: !!element.Legumes,
      tortilla: !!element.Tortilla,
      flatBread: !!element.Flatbread,
      chicken: !!element.Chicken,
      pork: !!element.Pork,
      beef: !!element.Beef,
      vege: !!element.Vegetarian,
      fish: !!element.Fish,
      turkey: !!element.Turkey,
      ham: !!element.Ham,
      soup: !!element.Soup,
      salad: !!element.Salad,
      recipe: '',
    };
    await mealsCreatePrisma(meal);
  }
};



export async function fillReceipe(mealsItems: Meal[]) {
  const mealPromises = mealsItems.map(async (item) => {
    if (!item.recipe || !item.ingredients) {
      const receipeResponse = await callLlm(
        findRecipe(item.name),
        [],
        { response_format: { type: 'json_object' }, model: 'gpt-3.5-turbo-1106' },
        undefined,
        ''
      );
      const jsonResponse: { recipe: string; ingredients: string } = JSON.parse(receipeResponse);
      item.recipe = jsonResponse.recipe;
      item.ingredients = jsonResponse.ingredients;
      await fetch(`${process.env.API_URL}/meals/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return item;
  });

  const updatedMealsItems = await Promise.all(mealPromises);
  return updatedMealsItems;
}
