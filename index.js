const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

const foods = require('./app/routes/api/v1/foods')
const Food = require('./app/models/food')
const Meal = require('./app/models/meal')

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin",
    "*");
  response.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  response.header("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.get('/', (request, response) => {
  response.send('Hello');
});

app.use('/api/v1/foods', foods)

app.get('/api/v1/meals/:id', (request, response) => {
  database('meals').where('id', request.params.id).select()
    .then((foods) => {
      response.status(200).json(foods);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/foods', (request, response) => {
  const food = request.body;

  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: {name: <String>, calories: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('foods').insert(food, 'id')
    .then(food => {
      response.status(201).json({ id: food[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/foods/:id', (request, response) => {
  database('meal_foods').join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .where('food_id', request.params.id)
  .del()
  .then((data) => {
    database('foods')
    .where('id', request.params.id)
    .del().returning('id')
    .then(id => response.send(`Deleted food ${id}`));
  })
});

app.get('/api/v1/meals_ids', (request, response) => {
  database('meals')
  .select('id','name')
  .then(meals => {
    response.status(200).json(meals);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

app.get('/api/v1/meals', (request, response) => {
  Meal.mealWithFoods()
  .then(foods => {

    // Gather Unique Meal IDs
    var meal_ids = [];
    for (var i = 0; i < foods.length; i++){
      if (meal_ids.includes(foods[i].meal_id)){}
      else {
        meal_ids.push(foods[i].meal_id)
      }
    }
    // Create new array to hold meal-food objects
    meals = [];

    // Take each unique meal ID, and make a new obejct
    meal_ids.forEach(oMealID =>{
      meal = {
        id: oMealID,
        name: "",
        updated_at:"",
        foods: [],
      }
      // Add new meal object to array, even if it won't have any foods

      meals.push(meal)

      //Go back throuhg foods, and add any foods that match this new meal object
      foods.forEach(food => {
        if(food.meal_id == oMealID){
          // Update meal name before deleteing it off the food object
          meal.name = food.meal_name;
          meal.updated_at = food.meal_updated_at;


          // Delete unwanted properties

          delete food.meal_id;
          delete food.meal_name;
          delete food.meal_updated_at;

          // Attach food
          meal.foods.push(food);
        }
      })
    })
    response.status(200).json(meals);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  database('meal_foods').where('meal_id', request.params.meal_id)
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .join('meals', 'meal_foods.meal_id', '=', 'meals.id')
  .select('foods.id AS id','foods.name AS name','calories','meals.name AS meal_name')
  .then(foods => {
    var new_foods = []
    var meal_name = foods[0].meal_name
    foods.forEach(function(v){
      delete v.meal_name
      new_foods.push(v)
    })
    var final_json = {'id': request.params.meal_id, 'name': meal_name, "foods": new_foods}
    response.status(200).json(final_json);
    })
});

app.patch('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).update(request.body).select()
    .then((a) => {
      database('foods').where('id', request.params.id).select()
        .then((foods) => {
          response.status(200).json(foods);
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    });
});

app.delete('/api/v1/meals/:meal_id/foods/:id', (request, response) => {
  database('meal_foods').where('meal_id', request.params.meal_id)
    .then(meal_foods => {
      relevent_meal_food = []
      for (i = 0; i < meal_foods.length; i++) {
        if(request.params.id == meal_foods[i].food_id) {
          relevent_meal_food.push(meal_foods[i])
        }
      }
      database('meal_foods').where('id', relevent_meal_food[0].id).del()
        .then(id => {
          response.send(`Successfully removed food from meal`)
        });
    })
});


app.post('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {

  database('meals').where('id', request.params.meal_id).then(meal =>{
    var mealName = meal[0].name
    database('foods').where('id', request.params.food_id).then(food =>{
      var foodName = food[0].name
      database('meal_foods').insert({food_id: request.params.food_id, meal_id: request.params.meal_id})
      .select()
      .then(food_meal => {
        response.status(201).json({message: `Successfully added ${foodName} to ${mealName}`})
      })
      .catch(error => {
        response.status(500).json({ error });
      });
    })
  })
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app.listen(4000);

// pry = require('pryjs')
// eval(pry.it)
