# BookReviewApp-server
This is a server application for BookReviewApp

## Preparing before start

1) Before running your own server, you must change these fields in the `.env` file according to your username and password in PostgreSQL:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

2) Then you should also run the file with the command: `node src/setup.js`. It will create a database on your computer with the relevant input data needed to test all the features of the application.

3) In the `src/send-mail.js` file, change the `email` field according to your email address. Then run this file with the command: `node src/send-mail.js`. Check your email to see if you received the message. This will help you to conclude that the SMPT server is working fine.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view the response of server in your browser.

The page will reload when you make changes.

### `npm run fix-style`

Runs code style fixes using prettier and eslint respectively
