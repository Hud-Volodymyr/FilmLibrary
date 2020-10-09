module.exports = (app) => {
  const films = require('../controllers/film.controller.js');
  // Add a new Film
  app.post('/films', films.addFilm);
  // Retrieve all Films sorted by name
  app.get('/films', films.showFilms);
  // Retrieve a single Film with by field
  app.get('/films/filmName', films.findByName);
  app.get('/actors/actorName', films.findByActor);
  // Upload a file of films
  app.post('/films/upload', films.uploadFile);
  // Delete a film with film name
  app.delete('/films/:filmName', films.deleteFilm);
};
