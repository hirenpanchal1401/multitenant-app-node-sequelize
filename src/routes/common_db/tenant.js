import express from 'express';
// import validate from 'express-validation';

import * as tenantController from '../../controllers/common_db/tenants.controller';

const router = express.Router();

router.get(
    '',
    tenantController.list
);

module.exports = router;
