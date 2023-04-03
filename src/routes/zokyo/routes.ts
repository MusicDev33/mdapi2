import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.post('/code', Routes.createNewChatRoute);
router.get('/convs/:username', Routes.getConversationsRoute);

export default router;
