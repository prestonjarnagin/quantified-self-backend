# Quantified Self Backend

This is the backend to the 'Quantified Self' project of Mod 4 of the backend program at Turing.

The purpose of this project was to build a backend service to deal with storing and serving food and calorie data to the Quantified Self frontend which allows users to track what foods they eat on each day with calorie tracking and goals.
While building the application, we practiced an agile workflow: building, updating, and maintaining a agile board through Waffle.io, writing and assigning user stories, conducting code reviews, and performing daily stand-ups.

### Endpoints
All endpoints are nested under `/api/v1/`

###### GET /api/v1/foods
Returns an array of all foods currently in the database

###### GET /api/v1/foods/:id
Returns the food with the given `id`

###### POST /api/v1/foods
Allows for the creation of a new food. In the body, include:
```
{
  "food":
    {
      "name": "Donut",
      "calories": "200"
    }
}
```

###### PATCH /api/v1/foods/:id
Allows for the updating of an individual food. The request body should me similar to that of the POST endpoint above.

###### DELETE /api/v1/foods/:id
Deletes the given food

###### GET /api/v1/meals
Returns a list off all foods in the database, with foods nested inside.

###### GET /api/v1/meals/:meal_id/foods
Similar to the `/meals` endpoint above, but only returns one meal

###### POST /api/v1/meals/:meal_id/foods/:food_id
Creates a relationship between a given `food_id` and `meal_id`, effectively adding a food to a meal

###### DELETE /api/v1/meals/:meal_id/foods/:id
Deletes the relationship mentioned in the POST request above


### Built With
* Node.js
* Express
* Mocha
* Knex
* Webpack
* ❤️
