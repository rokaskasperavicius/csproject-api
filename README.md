# API application for CS Project

- [API application for CS Project](#api-application-for-cs-project)
  - [Requirements ⚙️](#requirements-️)
  - [Starting the project 🛠](#starting-the-project-)
  - [API structure 🔒](#api-structure-)
    - [ER Diagram of the database](#er-diagram-of-the-database)
  - [Deploy 🚀](#deploy-)
    - [April 14th, 2022 Update](#april-14th-2022-update)

## Requirements ⚙️

- Node v16.14.x
- Npm v8.3.x

You can install Node.js with npm [here](https://nodejs.org/download/release/v16.14.0/).

## Starting the project 🛠

In your prefered terminal do:

1. `git clone git@github.com:rokaskasperavicius/cs-project-server.git`
2. `cd cs-project-server`
3. `npm install`
4. `npm run dev`
5. Wait a few seconds for babel to transpile the code
6. Open [http://localhost:5000/](http://localhost:5000/) to see the server application

## API structure 🔒

`index.js` is the starting file

### ER Diagram of the database

![ER Diagram](public/ER.png?raw=true 'Title')

## Deploy 🚀

Deployment happens automatically when the `main` branch receives new commits.

The website can be found [here](https://cs-project-server.herokuapp.com/).

### April 14th, 2022 Update

On April 13th, 2022 Heroku had a security breach ([Read updates here](https://status.heroku.com/incidents/2413)). Therefore, Heroku disabled GitHub integration until further notice.

As of right now, to deploy the API project you have to have access to the project on Heroku and have Heroku git remote set on your local machine.

`git push heroku main` will push the changes from the main branch to Heroku where it will be deployed
