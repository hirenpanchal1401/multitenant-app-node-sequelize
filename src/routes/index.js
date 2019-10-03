import express from 'express';

const app = express();

import userRoutes from './tenant_db/user';
import tenantRoutes from './common_db/tenant'

app.use('/users', userRoutes);
app.use('/tenant', tenantRoutes);

module.exports = app;