/* eslint-disable no-console */
import express from 'express';
import config from './config';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import renderBasket from './blue-basket/render';
import renderBuy from './blue-buy/render';
import { root, users } from './routes';
import { InitRabbitMQ } from './amqp';
import { InitMongoDb } from './mongodb';

InitMongoDb();
InitRabbitMQ();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/blue', express.static('./build'));
app.use('/blue-buy', (req, res) => {
  res.send(renderBuy());
});
app.use('/blue-basket', (req, res) => {
  res.send(renderBasket(0));
});
app.use('/', root);
app.use('/users', users);

const { app: { port } } = config;
app.listen(port);
console.log(`[info] server started at port ${port}. fragments are available here...`);
