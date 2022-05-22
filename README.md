# API for CS Project

- [API for CS Project](#api-for-cs-project)
  - [Requirements ⚙️](#requirements-️)
  - [Starting the project 🛠](#starting-the-project-)
  - [API structure 🔒](#api-structure-)
    - [Entity Relationship Diagram of the database](#entity-relationship-diagram-of-the-database)
  - [Deploy 🚀](#deploy-)
    - [April 14th, 2022 Update](#april-14th-2022-update)

## Requirements ⚙️

- Node v16.14.x
- NPM v8.3.x

You can install Node.js with npm [here](https://nodejs.org/download/release/v16.14.0/).

## Starting the project 🛠

In your prefered terminal do:

1. `git clone git@github.com:rokaskasperavicius/csproject-api.git`
2. `cd csproject-api`
3. `npm install`
4. `npm run setup`
6. `npm run dev`
7. Wait a few seconds for babel to transpile the code
8. Open [http://localhost:5000/](http://localhost:5000/) to see the server application

## API structure 🔒

`index.js` is the starting file.

Each route is under the `features` folder where it has a `routes` file for all routes and a `schema` file for all incoming query/body schemas.

For swagger documentation each route has a file under `swagger/paths` directory. Please follow the [OpenAPI](https://swagger.io/specification/) specifications.

### Entity Relationship Diagram of the database

![ER Diagram](public/ER.png?raw=true 'Title')

## Deploy 🚀

Deployment happens automatically when the `main` branch receives new commits.

The deployed API can be found on [https://csproject-api.herokuapp.com](https://csproject-api.herokuapp.com/).

### April 14th, 2022 Update

On April 13th, 2022 Heroku had a security breach ([Read updates here](https://status.heroku.com/incidents/2413)). Therefore, Heroku disabled GitHub integration from April 14th until further notice.

As of right now, to deploy the API project you have to have access to the project on Heroku and have Heroku git remote set on your local machine.

`git push heroku` will push the changes from the main branch to Heroku where it will be deployed.
