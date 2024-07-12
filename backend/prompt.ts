import { Meal } from './utils/interfaces/meal';

export const taskFinder = `<instruction>Based on the user message, judge whether the message is complex. </instruction>
<context>
Tasks to choose from:
0 no task to do - just simple answer needed
1 shopping list - adding, removing items to shopping list, getting shopping lists, all actions connected with grocy application, adding/removing  new product to product list
2 management playlist - all playlist CRUD operation
3 creating dinner schedules - all about creating dishes list and finding new receipes
4 searching for information on the Internet.
5 to do list - managing tasks - adding, deleting, completing getting lis of tasks
6 budget management
7 calendar
</context>
<action_examples>
Return only name of the task in Polish and number of the task in this JSON format eg. { "taskNumber": "0", "taskDescription": "lista zakupów"} and nothing else
</action_examples>`;

export const identifyProducts = (
  message: string,
  products: string[],
  category: string[]
) => {
  return `<instruction>
  You are an assistant who adds products to the shopping list. You have the command: ${message}.
  </instruction>
   <context>
   Find the products from the command by looking for their singular form in the list ${JSON.stringify(
    products
  )} and their id. If there is no product on the list, set product_id to 0 Match which category a specific product from the list fits into: ${JSON.stringify(
    category
  )}.
  </context>
  <action_examples>
  Sample response in JSON format: Command: Add 3 pears, Response: {"products": [{"productName":"pear", productId: 1, "count":3, "categoryName": "Fruit", "categoryId" :4 }]}, return only the object with all the products and nothing else
  </action_examples>`;
};

export const findRecipe = (mealName: string) => {
  return `<instruction>You are polish chef and you need to find most popular in Poland receipe and ingredients for ${mealName}, extract the ingredients and provide a brief recipe.</instruction>
  <action_examples>
  The output should be formatted as a JSON object with the fields recipe and ingredients. Both fields should contain strings in markdown format.
  </action_examples>`;
};

export const findMeal = (mealList: Meal[]) => {
  return `<instruction>
  Select one random meal from the list and return all the ingredients from the recipe:  ${mealList
    .map((meal) => meal.name)
    .join(', ')}
    <instruction>
     <action_examples>
    Return in JSON format eg.  {"mealName": "scrambled eggs", "ingredients": "eggs, salt, peppeer"}
    </action_examples>`;
};
export const findMealCondition = (message: string) => {
  return `<instruction>Cześć ChatGPT! Potrzebuję Twojej pomocy w przekształceniu zapytań użytkownika w tablicę zapytań do bazy danych Prisma na podstawie modelu Meal. Proszę, zaproponuj odpowiednie zapytanie na podstawie poniższej wiadomości użytkownika:

Wiadomość użytkownika: ${message}
  <instruction>
  <context>
   Model wygląda tak:
model Meal {
  id        Int       @id @default(autoincrement())
  name      String
  lastUsed  DateTime?
  created   DateTime  @default(now())
  dinner    Boolean   @default(false)
  supper    Boolean   @default(false)
  pasta     Boolean   @default(false)
  groats    Boolean   @default(false)
  rice      Boolean   @default(false)
  potatoes  Boolean   @default(false)
  legumes   Boolean   @default(false)
  tortilla  Boolean   @default(false)
  flatBread Boolean   @default(false)
  chicken   Boolean   @default(false)
  pork      Boolean   @default(false)
  beef      Boolean   @default(false)
  vege      Boolean   @default(false)
  fish      Boolean   @default(false)
  turkey    Boolean   @default(false)
  ham       Boolean   @default(false)
  soup      Boolean   @default(false)
  salad     Boolean   @default(false)
}
  </context>
  <action_examples>
Chciałbym, żebyś na podstawie wiadomości użytkownika określił, jakie zapytanie do bazy danych powinienem zrobić, aby otrzymać odpowiednią listę dań w formie tablicy JSON. Na przykład:

Wiadomość użytkownika: "przejrzyj liste obiadów i wybierz losowo jedną zupę, jedno danie z makaronem, jedno z kaszą, dodatkowo jedno danie wege, jedno z rybą, oraz jedną sałatkę
wypisz te obiady. Wyklucz z losowania dania które były oznaczone przed 30 marca 2024"

Powinno zwrócić:
 {answer: [
  {
    pasta: true,
    OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  },
  {
    groats: true,
    OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  },
    {
    vege: true,
    OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  },
   OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  },
    OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  }
]}



Oto kilka innych przykładów:
1. Wiadomość użytkownika: "Znajdź dania z kurczakiem"
   Powinno zwrócić:
   {answer: [
     {
       chicken: true,
     }
   ]}

2. Wiadomość użytkownika: "Znajdź dania z makaronem użyte najpóźniej 30.03.2024"
Powinno zwrócić:
{answer: [
  {
    pasta: true,
    OR: [
      {
        lastUsed: {
          lte: new Date('2024-03-30'),
        }
      },
      {
        lastUsed: null
      }
    ]
  }
]}

3.  Wiadomość użytkownika: "Znajdź jedno danie wegetariańskie i jedno z kurczakiem"
   Powinno zwrócić:
   {answer:[
     {
       vege: true,
     },
     {
       chicken: true,
     }
   ]}
     </action_examples>

`;
};
