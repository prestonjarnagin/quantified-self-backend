const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);


chai.use(chaiHttp);

before((done) => {
  database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });

});

beforeEach((done) => {
  database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
});

describe('Client Routes', () => {
  it('should return the homepage with text', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.equal('Hello');
      done();
    });
  });

  it('should return the homepage with text', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.not.equal('Goodbye');
      done();
    });
  });
});

describe('API Routes', () => {

  describe('GET', () => {
    it('GET api/v1/foods', done => {
      chai.request(server)
      .get('/api/v1/foods')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        // response.body[0].name.should.equal('Brownie');
        response.body[0].should.have.property('calories');
        // response.body[0].calories.should.equal('130');
        done();
      });
    });

    it('GET api/v1/meals', done => {
      chai.request(server)
      .get('/api/v1/meals')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('foods');
        response.body[0].foods[0].should.have.property('id');
        response.body[0].foods[0].should.have.property('name');
        response.body[0].foods[0].should.have.property('calories');
        done();
      });
    });

    it('GET api/v1/foods/:id', done => {
      chai.request(server)
      .get(`/api/v1/foods/`)
      .end((err, response) => {
        let foodID = response.body[0].id;
        chai.request(server)
        .get(`/api/v1/foods/${foodID}`)
        .end((err, response) => {

          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          // response.body[0].name.should.equal('Brownie');
          response.body[0].should.have.property('calories');
          // response.body[0].calories.should.equal('130');
          done();
        });
      })
    });

    it('GET api/v1/meals/:id', done => {
      chai.request(server)
      .get(`/api/v1/meals/`)
      .end((err, response) => {
        let mealID = response.body[0].id;
        chai.request(server)
        .get(`/api/v1/meals/${mealID}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          // response.body[0].name.should.equal('Dinner');
          done();
        });
      })
    })

    it('GET api/v1/meals/:id/foods', done => {
      chai.request(server)
      .get(`/api/v1/meals/`)
      .end((err, response) => {
        let mealID = response.body[0].id;
        chai.request(server)
        .get(`/api/v1/meals/${mealID}/foods`)
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.should.have.property('foods');
          response.body.foods.should.be.a('array');
          let food = response.body.foods[0]
          food.should.have.property('id');
          food.should.have.property('name');
          food.should.have.property('calories');
          done();
        });
      })
    })

  });

  describe('POST',() => {

    it('POST api/v1/foods', done => {
      let food = {
        name: "6oz Sirloin",
        calories: 312
      };
      chai.request(server)
      .post('/api/v1/foods')
      .send(food)
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
        done();
      });

    });

    it('POST api/v1/meals/:id/foods/:id', done =>{
      database('foods').where('name', 'Ice Cream').select()
        .then((food) => {
          database('meals').where('name', 'Dinner').select()
            .then((meal) => {
              chai.request(server)
              .post(`/api/v1/meals/${meal[0].id}/foods/${food[0].id}`)
              .send()
              .end((err, response) => {
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.have.property('message')
                response.body.message.should.equal('Successfully added Ice Cream to Dinner');
                done();
              });
            })
        })
      //add get request to check relationship has been created
    })

  });

});
