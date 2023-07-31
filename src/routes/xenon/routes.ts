import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.get('/parse', Routes.createXRawSectionRoute);

export default router;
