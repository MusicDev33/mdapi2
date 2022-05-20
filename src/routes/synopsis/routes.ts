import express from 'express';
const router = express.Router();
import * as Routes from './export';

import { generalAuth } from '@middleware/auth';

router.get('/bookid/:id', Routes.getSynopsisRoute);
router.put('/description/:id', Routes.editSynopsisDescRoute);

export default router;
