export interface Meal {
  id?: number;
  name: string;
  lastUsed?: Date;
  created: Date;
  dinner: boolean;
  supper: boolean;
  pasta: boolean;
  groats: boolean;
  rice: boolean;
  potatoes: boolean;
  legumes: boolean;
  tortilla: boolean;
  flatBread: boolean;
  chicken: boolean;
  pork: boolean;
  beef: boolean;
  vege: boolean;
  fish: boolean;
  turkey: boolean;
  ham: boolean;
  soup: boolean;
  salad: boolean;
  recipe?: string;
  ingredients?: string;
}
