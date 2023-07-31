import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.get('/parse', Routes.createXRawSectionRoute);
router.get('/xsources/all', Routes.getAllXSourcesRoute);

export default router;
