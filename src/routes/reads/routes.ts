import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.post('/create', Routes.createOneReadRoute);
router.get('/bookid/:bookId', Routes.getReadByIdRoute);
router.put('/bookid/:bookId', Routes.updateOneReadRoute);

export default router;
