## Client App Setup

Installera Dependency

bash
npm i

mac
npm install

## Environment Variables
Skapa en .env-fil och ange serverns webbadress som skulle vara http://localhost:5001/ för lokal server

`REACT_APP_SERVER_URL=http://localhost:5001/`

Starta App

bash
npm start

Mac
npm start

## Server Setup

Servern finns i ./server-directory

bash
cd ./server && npm i

Mac
cd ./server && npm install
## Environment Variables

Skapa en .env-fil i ./server och tillhandahåll mongoDB-urln och en tokenhemlighet

`DB_URL=url-to-your-mongoDB`.  
`TOKEN_SECRET=a-secure-random-string-to-encrypt-token`

Kör Server under utvecklingb läge

bash/Mac
npm run dev

Kör server i produktion

bash
npm start
