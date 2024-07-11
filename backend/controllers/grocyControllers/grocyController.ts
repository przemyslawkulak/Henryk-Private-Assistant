import { Request, Response } from 'express';
import { fetchJson, getFetchSettings, handleError } from './grocyHelpers';

export const getGrocyData = async (request: Request, response: Response) => {
  try {
    const url1 = 'https://grocy.byst.re/api/objects/locations';
    const url2 = 'https://grocy.byst.re/api/objects/products';
    const settings = getFetchSettings('GET');

    const [data1, data2] = await Promise.all([fetchJson(url1, settings), fetchJson(url2, settings)]);

    response.status(200).json({
      locations: data1.map((loc: any) => ({ id: loc.id, name: loc.name })),
      products: data2.map((prod: any) => ({ id: prod.id, name: prod.name })),
    });
  } catch (err) {
    handleError(response, err);
  }
};
