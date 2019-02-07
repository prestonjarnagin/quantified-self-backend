const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () =>
  database('foods')
  .select();

const find = (id) =>
  database('foods')
  .where('id', id)

module.exports = {
  all, find,
}
