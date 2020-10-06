# Film Library
Minimum Viable Product
## Glossary
 * [Prerequisites](#usage-prerequisites)
 * [Database setup](#set-up-database)
 * [Server setup](#set-up-server)
 * [Command Line Interface](#cli-setup)
 * [Tests](#tests-setup)
 * [Application architecture](#application-architecture)
    - [Database](#database-1)
    - [Server](#server)
    - [Client](#client)

### Usage Prerequisites:
* Cloned this reposiitory
#### Database
* Downloaded MySQL DBMS
* Created user film_user with password 12345678
#### Environment
* Node.js installed
* `npm init` was run

### Set up Database
1. Start Database service.
2. Change directory to project directory.
3. Login as a user with database creation privilegies.
4. Run `source film.sql` in mysql shell.

### Set up Server
1. Make sure to have `film_db` user set up with password `12345678`, or change USER and PASSWORD fields in `db.config.js` file.
2. Run server with `npm run start` command.

### CLI Setup
* You can run CLI in two ways:
    - from project root folder as `node ./cli-tool/commandline.js`
    - run `npm link` to be able to run CLI with `film-cli` command
### Tests Setup
* Before running tests make sure to set up mocked Database:
  - Change `DB` field in db.config.js so it points to empty database.
  - Run server.
  - Run `cli-film`, run `uploadFile -u sample_movies.csv` to fill database with values.
  - Kill server.
* After completing all previous steps run `npm run test`
### Application Architecture
#### Database
* The application runs on MySQL community edition database server.
#### Server
Apllication is written with MVC architecture in mind. Server covers model and controller parts. Database access is happening with raw queries thanks to `mysql` dependency. Express.js was chosen for quick sever routing setup.

#### Client

`film-cli` is a command line interface tool for abstracting user from direct http requests to server and providing with basic response transformation into viewable format.
This CLI has following commands:
  - help - lists all available commands
  - addFilm - adds one film to library
    - example command: `addFilm -n Call Me By Your Name -y 2017 -f Blu-Ray -a Army Hammer, Timothee Chalamet, Amira Casar`
  - getFilms - gets all films in library
  - getFilm - gets film with name
    - example command: `getFilm -n Call Me By Your Name`
  - getFilmByActor - gets film with actor named
    - example command: `getFilmByActor -actor Army Hammer`
  - uploadFile - upload a .csv file to add a list of films at once
    - example command: `uploadFile -u sample_movies.csv`
  - deleteFilm - delete film by name
    - example command: `deleteFilm -n Call Me By Your Name`
