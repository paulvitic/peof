import express from 'express';

export const root = express.Router();

/* GET home page. */
root.get('/', (req, res, next) => {
  res.render('root.js', { title: 'Express' });
});