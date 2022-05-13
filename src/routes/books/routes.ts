import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.post('/create', Routes.addNewBookRoute);
router.get('/search/:searchTerm', Routes.searchBooksRoute);
router.get('', Routes.getBooksRoute);

router.put('/change/:id', Routes.changeBookAttrRoute);

export default router;
