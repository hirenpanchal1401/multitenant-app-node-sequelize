import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

// import { connectAllDb } from './src/connectionManager';
import * as connectionResolver from './src/middlewares/connectionResolver';
import routes from './src/routes';

const PORT = 8080;
dotenv.config();
const app = express();

app.set('port', PORT);
app.use(bodyParser.json());

app.use(connectionResolver.resolve);

// API Route

app.use('/', routes);

app.get('/', (req, res, next) => {
  res.json({ body: 'Hello multi-tenant application.' });
});

app.listen(PORT, () => {
  console.log(`Express server started at port: ${PORT}`);
});
