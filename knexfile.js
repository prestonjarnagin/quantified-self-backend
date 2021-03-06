// Update with your config settings.

module.exports = {

  development: {
      client: 'pg',
      connection: 'postgres://localhost/calorie_tracker',
      migrations: {
        directory: './db/migrations'
      },
      seeds: {
        directory: './db/seeds/dev'
      },
      useNullAsDefault: true
    },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds/production'
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    }
  }

};
