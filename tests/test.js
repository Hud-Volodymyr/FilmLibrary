const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {expect} = chai;

chai.use(chaiHttp);
/* before doing tests make sure you created
a mock db and changed db.config file to connect to it.
Assuming mock db is generated from sample_movies.csv*/
describe('Movies HTTP request', () => {
  describe('GET /films', () => {
    it('Should return an array of 2 objects', (done) => {
      chai.request(app)
          .get('/films')
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[1]).to.be.an('object');
            done();
          });
    });
    it('Returned objects should have {FilmName, ReleaseYear, FormatName}',
        (done) => {
          chai.request(app)
              .get('/films')
              .end((err, res) => {
                if (err) done(err);
                expect(res.body[0]&&res.body[0])
                    .to
                    .have
                    .keys('FilmName', 'ReleaseYear', 'FormatName');
                done();
              });
        });
    it('Return objects should equal to', (done) => {
      chai.request(app)
          .get('/films')
          .end((err, res) => {
            if (err) done(err);
            expect(res.body[0])
                .to
                .eql({FilmName: 'The Godfather',
                  ReleaseYear: 1972,
                  FormatName: 'VHS'});
            expect(res.body[1])
                .to
                .eql({FilmName: 'The Seven Samurai',
                  ReleaseYear: 1954,
                  FormatName: 'VHS'});
            done();
          });
    });
  });
  describe('GET /films/:filmname', () => {
    it('Should get an array with one object in it', (done) => {
      const filmname = 'The_Godfather';
      chai.request(app)
          .get(`/films/${filmname}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.be.an('object');
            done();
          });
    });
    it('Object should be equal to', (done) => {
      const filmname = 'The_Godfather';
      chai.request(app)
          .get(`/films/${filmname}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body[0])
                .to
                .eql({FilmName: 'The Godfather',
                  ReleaseYear: 1972,
                  FormatName: 'VHS'});
            done();
          });
    });
    it('If we pass wrong name should return 404 with custom message',
        (done) => {
          let filmname = 'abracadabra';
          chai.request(app)
              .get(`/films/${filmname}`)
              .end((err, res) => {
                if (err) done(err);
                filmname = filmname.replace(/_/g);
                expect(res.status).to.equal(404);
                expect(res.body.message)
                    .to
                    .equal(`Did not find film with name ${filmname}.`);
                done();
              });
        });
  });
  describe('GET /actors/:actorName', () => {
    it('Should get an array with one object in it', (done) => {
      const actorname = 'Al_Pacino';
      chai.request(app)
          .get(`/actors/${actorname}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.be.an('object');
            done();
          });
    });
    it('Response should come with status code 404 and custom message',
        (done) => {
          let actorname = 'Unknown_Guy';
          chai.request(app)
              .get(`/actors/${actorname}`)
              .end((err, res) => {
                if (err) done(err);
                actorname = actorname.replace(/_/g, ' ');
                expect(res.status).to.equal(404);
                expect(res.body.message)
                    .to
                    .equal(`Did not find film with actor ${actorname}.`);
                done();
              });
        });
    it('Response should come with status code 422 and custom message',
        (done) => {
          let actorname = 'Unknown';
          chai.request(app)
              .get(`/actors/${actorname}`)
              .end((err, res) => {
                if (err) done(err);
                actorname = actorname.replace(/_/g, ' ');
                expect(res.status).to.equal(422);
                expect(res.body.message)
                    .to
                    .equal(`Invalid input: ${actorname}`);
                done();
              });
        });
  });
});
