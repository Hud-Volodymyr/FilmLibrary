'use strict';
const Film = require('../models/film.model.js');
module.exports = {
  addFilm: (req, res) => {
    if (!req.body) {
      res.status(400).send({message: 'Film can\'t be empty!'});
    }
    if (req.body.name && req.body.year && req.body.format && req.body.actors) {
      const film = new Film({
        name: req.body.name,
        year: req.body.year,
        format: req.body.format,
        actors: req.body.actors.split(', '),
      // actors is a string so we split it into array
      });
      Film.add(film, (err, data) => {
        if (err) {
          if (err == 409) {
            res.status(409).send({
              message: 'This film already exists',
            });
          } else {
            res.status(500).send({
              message: err.message||
          'Unknown error occurred while adding a new film',
            });
          }
        } else res.send(data);
      });
    } else {
      res.status(422).send('Invalid Input');
    }
  },
  deleteFilm: (req, res) => {
    req.params.filmName = req.params.filmName.replace(/_/g, ' ');
    Film.delete(req.params.filmName, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message:
          `Didn't find film called ${req.params.filmName.replace(/_/g, ' ')}.`,
          });
        } else {
          res.status(500).send({
            message: 'Could not delete film with name ' + req.params.filmName,
          });
        }
      } else {
        res.send({message: 'Film info was deleted successfully!'});
      }
    });
  },
  showFilms: (req, res) => {
    Film.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while retrieving films.',
        });
      } else res.send(data);
    });
  },
  findByName: (req, res) => {
    const filmName = req.query.filmName;
    if (filmName) {
      Film.findByName(filmName, (err, data) => {
        if (err) {
          console.log(err);
          if (err.kind === 'not_found') {
            res.status(404).send({
              message: `Did not find film with name ${filmName}.`,
            });
            res.end();
          } else {
            res.status(500).send({
              message: 'Error retrieving film with name ' +
              filmName,
            });
            res.end();
          }
        } else {
          res.send(data);
          res.end();
        }
      });
    }
  },
  findByActor: (req, res) => {
    const actorName = req.query.actorName;
    if (actorName) {
      const elements = actorName.split(' ');
      if (elements.length > 0 && elements.length < 3) {
        Film.findByActor(elements, (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              res.status(404).send({
                message: `Did not find film with actor ${actorName}.`,
              });
            } else {
              res.status(500).send({
                message: 'Error retrieving film with actor ' +
              actorName,
              });
            }
          } else {
            res.send(data);
          };
        });
      } else {
        res.status(422).send({
          message: 'Invalid input: ' + actorName,
        });
      }
    }
  },
  uploadFile: (req, res) => {
    const chunks = [];
    let data = '';
    req.on('data', (chunk) => {
      chunks.push(chunk);
    }).on('end', () => {
      data = Buffer.concat(chunks).toString();
      data = data.split(/\n/g);
      console.log(data);
      data = data.map((str) => str.split(','));
      Film.multiple(data, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message||
          'Unknown error occurred while adding a new film',
          });
        } else res.send(data);
      });
    });
  },
};
