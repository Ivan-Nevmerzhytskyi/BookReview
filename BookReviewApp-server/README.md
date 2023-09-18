# BookReviewApp-server
This is a server application for BookReviewApp

## Preparing before start

Before running your own server, you must change these fields in the `.env` file according to your username and password in PostgreSQL:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Then you should also run the file with the command: `node src/setup.js`. It will create a database on your computer with the relevant input data needed to test all the features of the application.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view the response of server in your browser.

The page will reload when you make changes.

### `npm run fix-style`

Runs code style fixes using prettier and eslint respectively
