/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import renderPage from './page/render';

const port = process.env.PORT || 8080;

const app = express();
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  const html = renderPage();
  res.render('layout', { html });
});

app.listen(port);
console.log(`🔴  team red running. product page is available here:
>> http://127.0.0.1:${port}/`);
