/* eslint-disable no-console */
import express from 'express';
import config from './config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { renderCompanyList } from './routes';
import { InitRabbitMQ } from './amqp';
import { InitMongoDb } from './mongodb';

InitMongoDb();
InitRabbitMQ();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/organization', express.static('./build'));
app.use('/company-list', renderCompanyList);

const { app: { port } } = config;
// if PORT env. variable exists use it as port otherwise use value from config file
const PORT = process.env.PORT || port;
app.listen(PORT);
console.log(`[info] server started at port ${port}. Fragments are available here...`);
