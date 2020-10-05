'use strict';
const Film = require('../models/film.model.js');
module.exports = {
  addFilm: (req, res) => {
    if (!req.body) {
      res.status(400).send({message: 'Film can\'t be empty!'});
    }
    const film = new Film({
      name: req.body.name,
      year: req.body.year,
      format: req.body.format,
      actors: req.body.actors.split(', '),
      // actors is a string so we split it into array
    });
    Film.add(film, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message||
          'Unknown error occurred while adding a new film',
        });
      } else res.send(data);
    });
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
    if (req.params.filmName) {
      Film.findByName(req.params.filmName.replace(/_/g, ' '), (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.status(404).send({
              message: `Not found film with name ${req.params.filmName}.`,
            });
          } else {
            res.status(500).send({
              message: 'Error retrieving film with name ' +
              req.params.filmName,
            });
          }
        } else res.send(data);
      });
    }
  },
  findByActor: (req, res) => {
    if (req.params.actorName) {
      const actor = req.params.actorName.replace(/_/g, ' ');
      Film.findByActor(actor, (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.status(404).send({
              message: `Not found film with actor ${actor}.`,
            });
          } else {
            res.status(500).send({
              message: 'Error retrieving film with actor ' +
              req.params.actor,
            });
          }
        } else {
          res.send(data);
        };
      });
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
