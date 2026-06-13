import { dishImages } from './foodPlaceholders';

const bowl = (id, name, description, price) => ({
  id,
  name,
  description,
  price,
  image: dishImages[id],
});

export const signatureBowls = [
  bowl(
    'butter-chicken',
    'The Butter Bowl Special',
    `Includes: Butter Rajma Bowl + Butter Chole Bowl
Can't choose between the two? Enjoy both of our signature butter-loaded bowls together in one satisfying meal.`,
    269
  ),
  bowl(
    'paneer-makhani',
    'Chole Lassi Combo',
    `Includes: Butter Chole Bowl (Chole Rice + Butter Topping) + Classic Lassi
    A satisfying combination of flavourful Butter Chole Bowl and a chilled Sweet Lassi.`,
    199
  ),
  bowl(
    'dal-makhani',
    'Rajma Lassi Combo',
    `Includes: Butter Rajma Bowl (Rajma Rice + Butter Topping) + Classic Lassi
A wholesome combo featuring our signature Butter Rajma Bowl paired with a refreshing Sweet Lassi..`,
    199
  ),
  bowl(
    'kadhai-paneer',
    'Rajma Parantha Power Meal',
    'Your favourite Rajma bowl and enjoy it with two freshly cooked paranthas for a filling North Indian feast.',
    119
  ),
];
