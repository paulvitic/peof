/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import {home} from "./routes/home";

const port = process.env.PORT || 8080;

const app = express();
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/framework', home);
app.get('/', home);

app.listen(port);
console.log(`🔴  framework running. home page is available here:
>> http://127.0.0.1:${port}/`);
