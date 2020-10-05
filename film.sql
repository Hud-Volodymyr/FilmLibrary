DROP DATABASE IF EXISTS film_db;
CREATE DATABASE film_db;
USE film_db;
BEGIN;
CREATE TABLE IF NOT EXISTS actors (
    ActorID INT NOT NULL AUTO_INCREMENT,
    ActorName VARCHAR(30) NOT NULL,
    ActorLastname VARCHAR(30) NOT NULL,
    PRIMARY KEY (ActorID),
    CONSTRAINT UC_actors UNIQUE (ActorName, ActorLastname)
)engine = innodb;
CREATE TABLE IF NOT EXISTS formats (
    FormatID INT NOT NULL AUTO_INCREMENT,
    FormatName VARCHAR(30) NOT NULL,
    PRIMARY KEY (FormatID)
)engine = innodb;
CREATE TABLE IF NOT EXISTS films (
    FilmID INT NOT NULL AUTO_INCREMENT,
    FilmName VARCHAR(30) NOT NULL,
    ReleaseYear SMALLINT NOT NULL,
    FormatID INT,
    PRIMARY KEY (FilmID),
    FOREIGN KEY (FormatID) REFERENCES formats (FormatID),
    UNIQUE (FilmName)
)engine = innodb;
CREATE TABLE IF NOT EXISTS connections (
    ID INT NOT NULL AUTO_INCREMENT,
    FilmID INT,
    ActorID INT,
    PRIMARY KEY(ID),
    FOREIGN KEY (FilmID) REFERENCES films(FilmID) ON DELETE CASCADE,
    FOREIGN KEY (ActorID) REFERENCES actors(ActorID) ON DELETE CASCADE
)engine = innodb;
COMMIT;

BEGIN;
INSERT INTO formats(FormatName) VALUES ('Blu-Ray'),
('DVD'),
('VHS');
COMMIT;
