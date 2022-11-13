## Client App Setup

Install Dependency

bash
npm i

## Environment Variables

Create a .env file & provide the server url this would be http://localhost:5000/ for local server

`REACT_APP_SERVER_URL=http://localhost:5000/`

Run App

bash
npm start

## Server Setup

The server is in the ./server directory

bash
cd ./server && npm i

## Environment Variables

Create a .env file in ./server & provide the mongoDB url & a token secret

`DB_URL=url-to-your-mongoDB`.  
`TOKEN_SECRET=a-secure-random-string-to-encrypt-token`

Run Server in development

bash
npm run dev

Run Server in production

bash
npm start
