import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.post('/gentoken', Routes.getAuthTokenRoute);

export default router;
