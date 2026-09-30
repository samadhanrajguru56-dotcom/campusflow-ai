import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
  getComments,
  getTicketHistory
} from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTicketSchema, updateTicketSchema, commentSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTicketSchema), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id', validate(updateTicketSchema), updateTicket);
router.delete('/:id', deleteTicket);

// Comments
router.post('/:id/comments', validate(commentSchema), addComment);
router.get('/:id/comments', getComments);

// Audit History
router.get('/:id/history', getTicketHistory);

export default router;
