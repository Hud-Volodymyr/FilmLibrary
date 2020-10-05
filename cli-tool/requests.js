'use strict';

const http = require('http');
const fs = require('fs');
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
    return;
  },
  getFilm(filmname) {
    http.get(`http://localhost:3000/films/${filmname}`, (resp) => {
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
        'Content-Length': data.length,
      },
    };
    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const jsoned = JSON.parse(data);
        delete jsoned.id1;
        jsoned.actors = jsoned.actors.join(', ');
        console.table(jsoned);
        console.log('Press enter to proceed');
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
      console.log(`statusCode: ${res.statusCode}`);
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
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/films/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'text/csv',
      },
    };
    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const jsoned = JSON.parse(data);
        console.log(jsoned);
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
