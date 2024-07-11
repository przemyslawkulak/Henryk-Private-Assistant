import { getFetchSettings } from '../controllers/grocyControllers/grocyHelpers';
import { callLlm } from '../llm';
import { identifyProducts } from '../prompt';

export async function addProductToShoppingList(product: any, createdProduct?: any, mealName?: string) {
  const url = 'https://grocy.byst.re/api/stock/shoppinglist/add-product';
  const settings = getFetchSettings('POST', {
    product_id: createdProduct?.created_object_id || product.productId,
    list_id: 1,
    product_amount: product.count,
    note: mealName ?? '',
  });

  return fetch(url, settings);
}

export async function addProduct(product: any): Promise<any> {
  const url = 'https://grocy.byst.re/api/objects/products';
  const settings = getFetchSettings('POST', {
    name: product.productName,
    location_id: product.categoryId,
    qu_id_purchase: '1',
    qu_id_stock: '1',
  });

  return fetch(url, settings);
}

export async function addingShoppingListFlow(message: string, conversationId: string, mealName?: string) {
  const grocyResponse = await fetch(`${process.env.API_URL}/grocy`, getFetchSettings('GET'));

  const data = await grocyResponse.json();

  const messages = identifyProducts(message, data.products, data.locations);
  const foundProducts = await callLlm(messages, [], { response_format: { type: 'json_object' } }, '', conversationId);
  const parsedfoundProducts = JSON.parse(foundProducts);

  for (const element of parsedfoundProducts.products) {
    if (!element.productId) {
      const product = await addProduct(element);
      const firstData = await product.json();
      await addProductToShoppingList(element, firstData, mealName);
    } else {
      await addProductToShoppingList(element, undefined, mealName);
    }
  }

  return { data, parsedfoundProducts };
}
