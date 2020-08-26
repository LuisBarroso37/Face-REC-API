## Face REC API

API for the [Face REC app](https://github.com/LuisBarroso37/Face-REC). 

The API was created using Node.js and Express.js. PostgreSQL is used as a database and Knex.js is used to communicate with the database in Node.js.
The session management and authentication is done using JWT and Redis.
I used Docker to containerize Node.js, PostgreSQL and Redis.

### Instructions
To run this app in a local environment, in the project directory:
  - Clone the repo
  - Run `npm install` to install the dependencies
  - Insert your environmental variables in the docker-compose.yml file.
  - Run `docker-compose up --build`
