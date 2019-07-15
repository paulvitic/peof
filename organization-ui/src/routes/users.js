import express from 'express';

export const users = express.Router();

users.get('/', (req, res, next) => {
    res.send('respond with a resource');
});
