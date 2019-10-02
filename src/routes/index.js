import express from 'express';

const app = express();

import userRoutes from './user';

app.use('/users', userRoutes);

module.exports = app;