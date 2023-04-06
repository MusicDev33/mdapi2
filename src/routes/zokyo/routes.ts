import express from 'express';
const router = express.Router();
import * as Routes from './export';

router.post('/code', Routes.createNewChatRoute);
router.get('/convs/:username', Routes.getConversationsRoute);
router.get('/msgs/:convId', Routes.getChatsByConvIdRoute);

router.post('/auth', Routes.authRoute);
router.post('/login/create', Routes.createLoginRoute);

export default router;
