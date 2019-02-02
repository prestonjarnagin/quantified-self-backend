exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('meal_foods').del() // delete all footnotes first
    .then(() => knex('foods').del())
    .then(() => knex('meals').del()) // delete all papers

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('foods').insert({
          name: 'Brownie', calories: 130
        }, 'id'),
        knex('foods').insert({
          name: 'Cake', calories: 400
        }, 'id'),
        knex('foods').insert({
          name: 'Ice Cream', calories: 800
        }, 'id'),
        knex('foods').insert({
          name: 'Donut', calories: 300
        }, 'id'),
        knex('foods').insert({
          name: 'Custard', calories: 500
        }, 'id'),
        knex('foods').insert({
          name: 'Kale', calories: 20
        }, 'id'),
        knex('meals').insert({
          name: 'Breakfast'
        }, 'id'),
        knex('meals').insert({
          name: 'Lunch'
        }, 'id'),
        knex('meals').insert({
          name: 'Dinner'
        }, 'id'),
        knex('meals').insert({
          name: 'Snack'
        }, 'id')
        .then(food =>{
          return knex('meal_foods').insert(
            {food_id: knex('foods').where('name', 'Brownie').select('id'), meal_id: knex('meals').where('name', 'Dinner').select('id')})
        }, 'id')
        .then(food =>{
          return knex('meal_foods').insert(
            {food_id: knex('foods').where('name', 'Cake').select('id'), meal_id: knex('meals').where('name', 'Dinner').select('id')})
        }, 'id')
        .then(food =>{
          return knex('meal_foods').insert(
            {food_id: knex('foods').where('name', 'Ice Cream').select('id'), meal_id: knex('meals').where('name', 'Breakfast').select('id')})
        }, 'id')
        .then(food =>{
          return knex('meal_foods').insert(
            {food_id: knex('foods').where('name', 'Custard').select('id'), meal_id: knex('meals').where('name', 'Snack').select('id')})
        }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
