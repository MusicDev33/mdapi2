import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.get('/bookid/:id', Routes.getSynopsisRoute);

router.put('/description/:id', Routes.editSynopsisDescRoute);

export default router;
