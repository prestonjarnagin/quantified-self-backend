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
          name: 'Brownie', calories: 250
        }, 'id'),
        knex('meals').insert({
          name: 'Dinner'
        }, 'id')
        .then(food =>{
          return knex('meal_foods').insert(
            {food_id: knex('foods').where('name', 'Brownie').select('id'), meal_id: knex('meals').where('name', 'Dinner').select('id')})
        }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

// knex('foods').first.id
// knex('foods').where('name', 'Brownie').select('id')
