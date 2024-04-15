import {Router} from 'express';
import { buyTicket, getAllAttendees, getAttendeeTickets, loginAttendee, refreshAccessToken, registerAttendee } from '../controllers/attendee.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router=Router();

router.get('/get-all',getAllAttendees);
router.post('/create',registerAttendee);
router.post('/login',loginAttendee);
router.post('/refresh-token',refreshAccessToken);
router.post('/buy-ticket/:eventId',verifyJWT, buyTicket);
router.get('/get-attendee-tickets',verifyJWT,getAttendeeTickets);


export default router;