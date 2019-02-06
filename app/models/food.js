const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () =>
  database('foods')
  .select();

const find = (id) =>
  database('foods')
  .where('id', id)

const foodWithMeals = () =>
  database('meal_foods')
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .join('meals', 'meal_foods.meal_id', '=', 'meals.id')
  .select('foods.id AS id',
        'foods.name AS name',
        'calories','meals.name AS meal_name',
        'meals.id AS meal_id',
        'meals.updated_at AS meal_updated_at')

module.exports = {
  all, find, foodWithMeals,
}
