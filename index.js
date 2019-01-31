const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

pry = require('pryjs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

app.get('/', (request, response) => {
  response.send('Hello');
});

app.get('/api/v1/meals', (request, response) => {
  database('meals').select()
    .then((meals) => {
      response.status(200).json(meals);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});



app.get('/api/v1/foods', (request, response) => {
  database('foods').select()
    .then((foods) => {

      response.status(200).json(foods);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});


app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
    .then((foods) => {
      response.status(200).json(foods);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

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
  database('foods').where('id', request.params.id).del().returning('id').then(id => response.send(`Deleted food ${id}`));
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
  database('meal_foods').raw('WHERE (meal_id = request.params.meal_id AND food_id = request.params.food_id)')
  .then(foods => {
    eval(pry.it)
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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app.listen(4000);

// pry = require('pryjs')
// eval(pry.it)
