# Northcoders News API

 ### Project Hosting Link: [ NC News API](https://nc-news-676h.onrender.com)
 
 

 ## Summary 
 NC News API  is a  RESTful API that provides endpoints for news articles,topics and user interaction. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture. With full Create, Read, Update and Delete (CRUD) functionality using the Model View Controller (MVC) software architecture and built using full Test Driven Development with Jest.

 ### Technologies Used:
 - Node.js
 - Express.js
 - Jest
 - Supertest
 - PostgreSQL

 ##  Getting Started
 Follow these instructions to get a copy of the project up and running on your local machine.

## Prerequisites
 Ensure you have the following installed:
 - Node.js: v22.1.0 or later
  - PostgreSQL: v16.3 or later

 ##  Cloning the Repository
 
 `git clone https://github.com/OpaogunProsper/nc-news-backend.git`

  `cd  nc-news-backend`


 ## Installing Dependencies
Install dependencies:
 `npm install`

## Setting up the Environment
Create two `.env` files in the root of your directory: `.env.dev` and `.env.test`.

##### In both of the files add this: 

PGDATABASE=database_name_here(followed with the appropriate suffix: dev/test)
## Set up the database
Do that by running: `npm setup-dbs` in your terminal
## Seeding the Local Database
To seed the dev database, run the following command:

npm run seed

## Running Tests

To run tests, use the following command:

`npm test`

If any issues are encountered, please open an issue on the repo.
 
 ## Endpoints
 For the endpoints available, please refer to the `endpoints.json` file in the GitHub repository.