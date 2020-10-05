#!/usr/bin/env node
'use strict';

const handlers = require('./requests.js');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

rl.on('line', (input) => {
  let line = input.trim();
  let upload;
  let name;
  let year;
  let format;
  let actors;
  if (line.match('-n')) {
    [line, name] = line.split('-n');
    if (name.match('-y')) {
      [name, year] = name.split('-y');
      [year, format] = year.split('-f');
      [format, actors] = format.split('-a');
    }
  }
  if (line.match('-u')) {
    [line, upload] = line.split('-u');
  }
  // console.log(line, name, year, format, actors);
  const arg1 = line.trim();
  if (arg1 === '') {
    rl.prompt();
  } else {
    const command = handlers[arg1];
    if (command) {
      if (!name && !upload) command();
      else {
        if (!year&&!format&&!actors) {
          if (name) {
            command(name.trim());
          } else command(upload.trim());
        } else {
          command(name.trim(), year.trim(), format.trim(), actors.trim());
        }
      }
    } else {
      console.log('Invalid input: ' + input);
    }
  }
  rl.prompt();
}).on('close', () => {
  console.log('\nBye!');
  process.exit(0);
});
