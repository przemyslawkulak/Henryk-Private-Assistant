import { Request, Response, Router, NextFunction } from 'express';
import { findMeal, findMealCondition, taskFinder } from '../prompt';
import { callLlm } from '../llm';
import { Tasks } from '../enums';
import { v4 } from 'uuid';
import { currentConversation } from '../conversation';
import mealsGetPrisma from '../utils/db/meals/getMeals';
import { Meal } from '../utils/interfaces/meal';
import { addingShoppingListFlow } from '../services/grocyService';

const router = Router();

const handlePostRequest = async (request: Request, response: Response, next: NextFunction) => {
  try {
      const { message } = request.body;
      const conversationId = await initiateConversation(request);
      response.set('x-conversation-id', conversationId);

      const conversation = await currentConversation(conversationId);
      const answer = await callLlm(
          message,
          conversation,
          { response_format: { type: 'json_object' } },
          taskFinder,
          conversationId
      );

      const parsedAnswer = JSON.parse(answer);
      const taskNumber = +parsedAnswer.taskNumber;

      switch (taskNumber) {
          case Tasks.ShoppingList:
              await handleShoppingListTask(message, conversationId, parsedAnswer, response);
              break;
          case Tasks.CreatingDinnerSchedules:
              await handleCreatingDinnerSchedulesTask(message, conversation, conversationId, response);
              break;
          case Tasks.SearchingInternet:
          case Tasks.None:
              await handleSearchingInternetTask(message, conversation, conversationId, response);
              break;
          default:
              response.status(200).json({ answer: parsedAnswer.taskDescription });
              break;
      }
  } catch (err) {
      next(err);
  }
};

const handleError = (err: any, request: Request, response: Response, next: NextFunction) => {
    console.error(err);
    response.status(500).json({
        status: 'error',
        data: `${request?.body?.type?.toUpperCase() || 'Unknown response'} could not be saved.`,
    });
};

const initiateConversation = async (request: Request): Promise<string> => {
    const conversationId = (request.headers['x-conversation-id'] as string) || v4();
    await currentConversation(conversationId);
    return conversationId;
};

const handleShoppingListTask = async (message: string, conversationId: string, parsedAnswer: any, response: Response) => {
    const { data, parsedfoundProducts } = await addingShoppingListFlow(message, conversationId);
    response.status(200).json({
        answer: parsedAnswer.taskDescription,
        grocyResponse: data,
        foundProducts: parsedfoundProducts
    });
};

const handleCreatingDinnerSchedulesTask = async (message: string, conversation: any, conversationId: string, response: Response) => {
    const mealCondtition = await callLlm(
        findMealCondition(message),
        conversation,
        { response_format: { type: 'json_object' } },
        undefined,
        conversationId
    );

    const parsedAnswer = JSON.parse(mealCondtition);
    let results = '';
    const grocyResponse = [];
    const foundProducts = [];

    for (const query of parsedAnswer.answer) {
        try {
            const mealList = await mealsGetPrisma(query) as Meal[];
            const oneMeal = findMeal(mealList);

            const answer = await callLlm(
                oneMeal,
                conversation,
                { response_format: { type: 'json_object' } },
                undefined,
                conversationId
            );

            const { mealName, ingredients } = JSON.parse(answer);
            const { data, parsedfoundProducts } = await addingShoppingListFlow(ingredients, conversationId, mealName);
            results += `* ${mealName}, <br>`;
            grocyResponse.push(data);
            foundProducts.push(parsedfoundProducts);
        } catch (error) {
            console.error('Error processing one of the queries:', error);
        }
    }

    response.status(200).json({
        answer: results,
        type: parsedAnswer.taskDescription,
        grocyResponse,
        foundProducts,
    });
};

const handleSearchingInternetTask = async (message: string, conversation: any, conversationId: string, response: Response) => {
    const searchResult = await callLlm(message, conversation, {}, undefined, conversationId);
    response.status(200).json({
        answer: searchResult,
    });
};



router.post('/', handlePostRequest);
router.use(handleError);

export default router;
