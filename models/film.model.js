/* eslint-disable no-multi-str */
'use strict';
const sql = require('./db.js');

const Film = function(film) {
  this.name = film.name;
  this.year = film.year;
  this.format = film.format;
  this.actors = film.actors;
};

Film.add = (newFilm, result) => {
  sql.query('INSERT IGNORE INTO films (FilmName, ReleaseYear, FormatID) \
VALUES (?, ?, (SELECT FormatID FROM formats WHERE FormatName=?))',
  [newFilm.name, +newFilm.year, newFilm.format],
  (err, data) => {
    if (err) {
      console.log('error:', err);
      result(err, null);
      return err;
    }
    Film.addActors(newFilm, (err, data) => {
      if (err) console.log(err);
      return;
    });
    console.log('Added film:', {id1: data.insertId, ...newFilm});
    result(null, {id1: data.insertId, ...newFilm});
    return;
  });
};


Film.addActors = (newFilm, result) => { // actors is an array, example:
// ["Army Hammer", "Timothee Chalamet", "Amira Casar"]
  newFilm.actors.forEach((actor, index) => {
    const elements = actor.split(' ');
    sql.query('INSERT IGNORE INTO actors(ActorName, ActorLastname)\
    VALUES (?, ?)',
    [elements[0], elements[1]], (err, data) => {
      if (err) {
        console.log('error:', err);
        result(err, null);
        return err;
      }
      console.log(`Added actor ${actor}`,
          {
            id2: data.insertId,
            actors: actor,
          });
      return {
        id2: data.insertId,
        actors: actor,
      };
    });
    sql.query('INSERT INTO connections(FilmID, ActorID)\
      VALUES ((SELECT FilmID FROM films WHERE FilmName=?),\
        (SELECT ActorID FROM actors WHERE ActorLastname=?))',
    [newFilm.name, elements[1]], (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Connected ${newFilm.name} to ${actor}`);
    });
  });
};

Film.delete = (filmName, result) => {
  let flag = 0;
  const FilmData = sql.query('DELETE FROM films WHERE FilmName=?',
      filmName, (err, data) => {
        if (err) {
          console.log('error: ', err);
          result(null, err);
          return;
        }
        if (data.affectedRows == 0) {
          // not found film with such a name
          result({kind: 'not_found'}, null);
          return;
        };
        flag = 1;
        console.log(`Deleted film with name: ${filmName}`);
        return data;
      });
  sql.query('DELETE FROM actors\
  WHERE ActorID not in (select ActorID from connections);', filmName,
  (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    if (flag) result(null, FilmData);
  });
};

Film.getAll = (result) => {
  sql.query('SELECT FilmName, ReleaseYear, FormatName FROM films\
   INNER JOIN formats ON formats.FormatID=films.FormatID\
   ORDER BY FilmName ASC', (err, data) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, data);
  });
};

Film.findByActor = (actor, result) => {
  sql.query('select distinct FilmName, ReleaseYear, FormatName\
  from films inner join connections on connections.FilmID=films.FilmID\
  inner join actors on actors.ActorID=connections.ActorID\
  inner join formats on formats.FormatID=films.FormatID\
  where ActorName=? AND ActorLastname=?', actor, (err, data) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (data.length) {
      result(null, data);
      return;
    }

    // not found film with the name
    result({kind: 'not_found'}, null);
  });
};
Film.findByName = (filmName, result) => {
  sql.query('SELECT FilmName, ReleaseYear, FormatName\
  FROM films INNER JOIN formats ON films.FormatID=formats.FormatID\
  WHERE FilmName=?', filmName, (err, data) => {
    if (err) {
      result(err, null);
      return;
    }

    if (data.length) {
      result(null, data);
      return;
    }

    // not found film with the name
    result({kind: 'not_found'}, null);
  });
};

Film.multiple = (dataset, result) => {
  let counter = 0;
  dataset.forEach((data, index, arr) => {
    const film = new Film({
      name: data[0],
      year: data[1],
      format: data[2],
      actors: data.slice(3),
      // for actors we slice data here and get an array of actors
    });
    sql.query('INSERT IGNORE INTO films (FilmName, ReleaseYear, FormatID) \
VALUES (?, ?, (SELECT FormatID FROM formats WHERE FormatName=?))',
    [film.name, +film.year, film.format],
    (err, data) => {
      counter++;
      if (err) {
        console.log('error:', err);
        result(err, null);
        return err;
      }
      Film.addActors(film, (err, data) => {
        if (err) console.log(err);
        return;
      });
      console.log('Added film:', {id1: data.insertId, ...film});
      if (counter === arr.length) {
        result(null, dataset);
      }
    });
  });
};

module.exports = Film;
