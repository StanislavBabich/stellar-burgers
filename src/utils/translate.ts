import { TIngredient, TOrder } from './types';

const INGREDIENT_NAMES: Record<string, string> = {
  'Краторная булка N-200i': 'Crater bun N-200i',
  'Флюоресцентная булка R2-D3': 'Fluorescent bun R2-D3',
  'Биокотлета из марсианской Магнолии': 'Biocutlet from Martian Magnolia',
  'Филе Люминесцентного тетраодонтимформа':
    'Fillet of Luminescent Tetraodontimform',
  'Мясо бессмертных моллюсков Protostomia':
    'Meat of immortal Protostomia mollusks',
  'Говяжий метеорит (отбивная)': 'Beef meteorite (chop)',
  'Соус Spicy-X': 'Spicy-X sauce',
  'Соус фирменный Space Sauce': 'Signature Space Sauce',
  'Соус традиционный галактический': 'Traditional galactic sauce',
  'Соус с шипами Антарианского плоскоходца':
    'Sauce with Antarian Flatwalker spines',
  'Хрустящие минеральные кольца': 'Crunchy mineral rings',
  'Плоды Фалленианского дерева': 'Fruit of the Fallenian tree',
  'Кристаллы марсианских альфа-сахаридов': 'Martian alpha-saccharide crystals',
  'Мини-салат Экзо-Плантаго': 'Mini salad Exo-Plantago',
  'Сыр с астероидной плесенью': 'Cheese with asteroid mold'
};

const ORDER_NAME_REPLACEMENTS: Array<[RegExp, string]> = [
  [/традиционный-галактический/gi, 'traditional-galactic'],
  [/флюоресцентн\w*/gi, 'fluorescent'],
  [/люминесцентн\w*/gi, 'luminescent'],
  [/краторн\w*/gi, 'crater'],
  [/бессмертн\w*/gi, 'immortal'],
  [/биокотлет\w*/gi, 'biocutlet'],
  [/марсианск\w*/gi, 'martian'],
  [/фалленианск\w*/gi, 'fallenian'],
  [/антарианск\w*/gi, 'antarian'],
  [/традиционн\w*/gi, 'traditional'],
  [/галактическ\w*/gi, 'galactic'],
  [/минеральн\w*/gi, 'mineral'],
  [/астероидн\w*/gi, 'asteroid'],
  [/фирменн\w*/gi, 'signature'],
  [/говяж\w*/gi, 'beef'],
  [/хрустящ\w*/gi, 'crunchy'],
  [/тетраодонтимформ\w*/gi, 'tetraodontimform'],
  [/плоскоходц\w*/gi, 'flatwalker'],
  [/магноли\w*/gi, 'magnolia'],
  [/альфа-сахарид\w*/gi, 'alpha-saccharides'],
  [/экзо-плантаго/gi, 'exo-plantago'],
  [/моллюск\w*/gi, 'mollusks'],
  [/метеорит\w*/gi, 'meteorite'],
  [/отбивн\w*/gi, 'chop'],
  [/бургер\w*/gi, 'burger'],
  [/булк\w*/gi, 'bun'],
  [/соус\w*/gi, 'sauce'],
  [/филе/gi, 'fillet'],
  [/мясо/gi, 'meat'],
  [/плод\w*/gi, 'fruit'],
  [/дерев\w*/gi, 'tree'],
  [/кристалл\w*/gi, 'crystals'],
  [/салат\w*/gi, 'salad'],
  [/сыр\w*/gi, 'cheese'],
  [/кольц\w*/gi, 'rings'],
  [/шип\w*/gi, 'spines'],
  [/плесень\w*/gi, 'mold']
];

export const translateIngredientName = (name: string): string =>
  INGREDIENT_NAMES[name] ?? name;

export const translateOrderName = (name: string): string => {
  let result = name;
  for (const [pattern, replacement] of ORDER_NAME_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  result = result.replace(/\s+/g, ' ').trim();
  return result ? result.charAt(0).toUpperCase() + result.slice(1) : result;
};

export const translateIngredient = <T extends TIngredient>(
  ingredient: T
): T => ({
  ...ingredient,
  name: translateIngredientName(ingredient.name)
});

export const translateOrder = (order: TOrder): TOrder => ({
  ...order,
  name: translateOrderName(order.name)
});

export const translateOrders = (orders: TOrder[]): TOrder[] =>
  orders.map(translateOrder);
