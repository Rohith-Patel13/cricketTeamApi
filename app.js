//step 1:import the Express.js library in Node.js using CommonJS syntax
const express = require("express");

//step 2:create an instance of an Express application in Node.js
const app = express();

//step 3:
/*
express.json() is a built-in middleware provided by the express package.
It parses incoming JSON payloads from the request body and makes them
available in req.body. This is useful when you want to handle JSON data
sent in the request body, commonly used in API endpoints.
*/
app.use(express.json());

//step 4:
/*
using the require function to import the open method from
the "sqlite" module. This code snippet indicates that you want to
use SQLite in your Node.js application.

The sqlite module is not a built-in Node.js module but is likely
referring to a third-party package that provides support for working
with SQLite databases in Node.js. Specifically, it appears you are using
the sqlite module's open method, which allows you to open a connection to
an SQLite database.

To use this module, you need to make sure it is installed in your project.
You can install it using npm (Node Package Manager) with the
following command:
"npm install sqlite"
*/
const { open } = require("sqlite");

//step 5:
/*
console.log(sqlite3);
{
  Database: [Function: Database],
  Statement: [Function: Statement],
  ...
  ...
*/
const sqlite3 = require("sqlite3");

//step 6:
/*
imported the Node.js core module path.
The path module provides utilities for
working with file and directory paths. 
*/
const path = require("path");

//step 7:
/*
using the path.join() method to create a complete file path
for an SQLite database named "cricketTeam.db" based on the
current directory (__dirname).
*/
let dbPath = path.join(__dirname, "cricketTeam.db"); //OUTPUT: /home/workspace/nodejs/coding-practices/coding-practice-4a/cricketTeam.db

//step 8:
let dbConnectionObject = null;

//step 8:
const initializeDBandServer = async () => {
  try {
    //step 10:
    /*
          open a connection to an SQLite database using the open method
          from the sqlite module.
          */
    dbConnectionObject = await open({
      filename: dbPath, // This will open a connection to the "cricketTeam.db" database located at the full path generated
      driver: sqlite3.Database,
      /*
            console.log(sqlite3);
            {
                Database: [Function: Database],
                Statement: [Function: Statement],
                ...
                ...
            }
            */
    });
    //step 11:
    /*
    start the Express server and listen on port 3000.
    When you call app.listen(port, callback), it tells
    Express to bind and listen to connections on the specified port number.
    */
    app.listen(3000, () => {
      console.log("start the Express server and listen on port 3000. ");
    });
  } catch (error) {
    console.log(`ERROR:${error.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

//API 1 :
app.get("/players/", async (requestObject, responseObject) => {
  const requestBodyObject = requestObject.body;
  const { player_name, jersey_number, role } = requestBodyObject;
  const playersQuery = `SELECT * FROM cricket_team;`;
  const dbResponse = await dbConnectionObject.all(playersQuery); //await used because it returns promise object
  const dbResponseResult = dbResponse.map((eachPlayerDetailsObject) => {
    return {
      playerId: eachPlayerDetailsObject.player_id,
      playerName: eachPlayerDetailsObject.player_name,
      jerseyNumber: eachPlayerDetailsObject.jersey_number,
      role: eachPlayerDetailsObject.role,
    };
  });
  responseObject.send(dbResponseResult);
});

//API 2:
app.post("/players/", async (requestObject, responseObject) => {
  const requestBodyObject = requestObject.body;
  const { playerName, jerseyNumber, role } = requestBodyObject;
  const playersQuery = `INSERT INTO
   cricket_team(player_name, jersey_number, role)
   VALUES
   ( '${playerName}',
    '${jerseyNumber}',
    '${role}');`;
  await dbConnectionObject.run(playersQuery);

  responseObject.send("Player Added to Team");
});

//API 3:
app.get("/players/:playerId/", async (requestObject, responseObject) => {
  const requestBodyObject = requestObject.body;
  const { player_id, player_name, jersey_number, role } = requestBodyObject;

  const playerIdObject = requestObject.params;
  //console.log(playerIdObject); //OUTPUT: { playerId: '1' }
  const { playerId } = playerIdObject;
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id='${playerId}';`;
  const dbResponse = await dbConnectionObject.get(playerQuery);
  const modifiedDbResponse = {
    playerId: dbResponse.player_id,
    playerName: dbResponse.player_name,
    jerseyNumber: dbResponse.jersey_number,
    role: dbResponse.role,
  };

  responseObject.send(modifiedDbResponse);
});

//API 4:
app.put("/players/:playerId/", async (requestObject, responseObject) => {
  const requestBodyObject = requestObject.body;
  const { playerName, jerseyNumber, role } = requestBodyObject;
  const playerIdObject = requestObject.params;
  //console.log(playerIdObject); //{ playerId: '5' }
  const { playerId } = playerIdObject;
  const playerQuery = `UPDATE  cricket_team SET
  player_name='${playerName}',jersey_number='${jerseyNumber}',
  role='${role}' WHERE player_id='${playerId}' ;`;
  await dbConnectionObject.run(playerQuery);
  responseObject.send("Player Details Updated");
});

//API 5:
app.delete("/players/:playerId/", async (requestObject, responseObject) => {
  const playerIdObject = requestObject.params;
  const { playerId } = playerIdObject;
  const playerQuery = `DELETE FROM cricket_team WHERE player_id = '${playerId}';`;
  await dbConnectionObject.run(playerQuery);
  responseObject.send("Player Removed");
});

module.exports = app;
