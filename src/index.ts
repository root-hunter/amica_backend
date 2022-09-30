import express, { Express, Router } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const jsonBodyParser = bodyParser.json();

import routesFarmaciCrud from './api/farmaci/crud'
app.use('/api/farmaci',
  jsonBodyParser, routesFarmaciCrud());

import routesPazientiCrud from './api/pazienti/crud'
app.use('/api/pazienti',
  jsonBodyParser, routesPazientiCrud());

import routesPatologieCrud from './api/patologie/crud'
app.use('/api/patologie',
  jsonBodyParser, routesPatologieCrud());

import firebaseListenerPazientiCrud from "./firebase/listeners/pazienti/crud"
import firebaseListenerFarmaciCrud from "./firebase/listeners/farmaci/crud"
import firebaseListenerPatologieCrud from "./firebase/listeners/patologie/crud"

app.listen(port, () => {
  firebaseListenerPazientiCrud();
  firebaseListenerFarmaciCrud();
  firebaseListenerPatologieCrud();
  
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
