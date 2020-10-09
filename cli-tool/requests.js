/* eslint-disable require-jsdoc */
'use strict';

const http = require('http');
const fs = require('fs');
const {URL} = require('url');

const formats = ['DVD', 'VHS', 'Blu-Ray'];
const validYear = (year) => (+year >=1850 && +year<=2020) ? 1 : 0;
const validFormat = (format) => (formats.includes(format) ? 1 : 0);
function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

const commands = {
  help() {
    console.log('Commands:', Object.keys(commands).join(', '));
  },
  getFilms() {
    http.get('http://localhost:3000/films', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        console.table(JSON.parse(data));
        console.log('Press enter to proceed');
      });
    });
  },
  getFilm(filmname) {
    const searchUrl = new URL('http://localhost:3000/films/filmName');
    searchUrl.searchParams.set('filmName', filmname);
    http.get(searchUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        console.table(JSON.parse(data));
        console.log('Press enter to proceed');
      });
    });
  },
  getFilmByActor(actorname) {
    const searchUrl = new URL('http://localhost:3000/actors/actorName');
    searchUrl.searchParams.set('actorName', actorname);
    http.get(searchUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        console.table(JSON.parse(data));
        console.log('Press enter to proceed');
      });
    });
  },
  addFilm(filmName, releaseYear, formatName, actors) {
    if (!validYear(releaseYear)) {
      console.log('Year should be between 1850 and 2020!');
      return;
    }
    if (!validFormat(formatName)) {
      console.log(`Format should be one of 3: ${formats.join(', ')}`);
      return;
    }
    if (hasDuplicates(actors.split(', '))) {
      console.log('Actors should have unique names!');
      return;
    }
    const data = JSON.stringify({
      name: filmName,
      year: releaseYear,
      format: formatName,
      actors: actors,
    });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/films',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const jsoned = JSON.parse(data);
        if (jsoned.id1) {
          delete jsoned.id1;
          jsoned.actors = jsoned.actors.join(', ');
          console.table(jsoned);
          console.log('Press enter to proceed');
        } else {
          const jsoned = JSON.parse(data);
          console.log(jsoned.message);
          console.log('Press enter to proceed');
        }
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.write(data);
    req.end();
  },
  deleteFilm(filmname) {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/films/' + filmname.split(' ').join('_'),
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const jsoned = JSON.parse(data);
        console.log(jsoned.message);
        console.log('Press enter to proceed');
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });
    req.end();
  },
  uploadFile(filepath) {
    let options = {};
    const filename = filepath.split('/').pop();
    const extention = filename
        .slice((Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1);
    console.log(extention);
    if (extention === 'csv') {
      options = {
        hostname: 'localhost',
        port: 3000,
        path: '/films/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
      };
    } else if (extention === 'txt') {
      options = {
        hostname: 'localhost',
        port: 3000,
        path: '/films/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
      };
    } else {
      console.log('Only txt and csv file extensions are allowed!');
      return;
    }
    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const jsoned = JSON.parse(data);
        console.table(jsoned);
        console.log('Press enter to proceed');
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });
    const readStream = fs.createReadStream(filepath);
    readStream.pipe(req);
    readStream.on('end', () => {
      req.end();
    });
  },
};


module.exports = commands;
