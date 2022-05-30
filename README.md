# API for CS Project

- [API for CS Project](#api-for-cs-project)
  - [Requirements ⚙️](#requirements-️)
  - [Starting the project 🛠](#starting-the-project-)
  - [API structure 🔒](#api-structure-)
    - [Entity Relationship Diagram of the database](#entity-relationship-diagram-of-the-database)
  - [Deploy 🚀](#deploy-)
    - [April 14th, 2022 Update](#april-14th-2022-update)

## Requirements ⚙️

- Node v16.14.0

You can install Node.js [here](https://nodejs.org/download/release/v16.14.0/). Npm should automatically be installed.

## Starting the project 🛠

In your prefered terminal do:

1. `git clone git@github.com:rokaskasperavicius/csproject-api.git`
2. `cd csproject-api`
3. It is important that you create a `.env` file in the root folder and insert environment variables needed to access the database and send emails.
4. After creating the `.env` file insert these variables:

```
DATABASE_URL=postgres://uwusarbioyyihg:286d366d6c9a509942a37bdc167c45a78969b9f260260cdb283b5b65f3eab9e2@ec2-54-195-141-170.eu-west-1.compute.amazonaws.com:5432/dbm2pj82np6pep

SENDGRID_API_KEY=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
```

5. `npm install`
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
