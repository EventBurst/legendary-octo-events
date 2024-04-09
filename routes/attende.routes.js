import {Router} from 'express';
import { getAllAttendees, loginAttendee, refreshAccessToken, registerAttendee } from '../controllers/attendee.controller.js';

const router=Router();

router.get('/get-all',getAllAttendees);
router.post('/create',registerAttendee);
router.post('/login',loginAttendee);
router.post('/refresh-token',refreshAccessToken);



export default router;