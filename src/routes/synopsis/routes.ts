import express from 'express';
const router = express.Router();
import * as Routes from './export';

import { generalAuth } from '@middleware/auth';

router.get('/bookid/:bookId', [generalAuth], Routes.getSynopsisRoute);
router.get('/id/:id', Routes.getSynopsisRoute);

router.put('/description/:id', [generalAuth], Routes.editSynopsisDescRoute);

export default router;
