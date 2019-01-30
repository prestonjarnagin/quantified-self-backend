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
  describe('GET', () =>{
    it('GET api/v1/foods', done => {
      chai.request(server)
      .get('/api/v1/foods')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Brownie');
        response.body[0].should.have.property('calories');
        response.body[0].calories.should.equal('130');
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
        response.body[0].name.should.equal('Dinner');
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
          response.body[0].name.should.equal('Brownie');
          response.body[0].should.have.property('calories');
          response.body[0].calories.should.equal('130');
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
          response.body[0].name.should.equal('Dinner');
          done();
        });
      })
    })

  });
});
