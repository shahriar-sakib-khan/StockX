import { Router } from 'express';

import { initiatePaymentSession, handleIPN } from '@/controllers/v1/index.js';
import { authenticateUser, validatePaymentInput } from '@/middlewares/index.js';

const router = Router();

router.post('/initiate', authenticateUser, validatePaymentInput, initiatePaymentSession);
router.post('/ipn', handleIPN);

router.post('/success/:tranId', (req, res) => {
  res.status(200).send(`
    <h1>✅ Thank you!</h1>
    <p>Your payment is being processed.</p>
    <p>We'll update your account shortly.</p>
  `);
});
router.post('/fail', (req, res) => {
  res.status(200).send(`
    <h1>❌ Payment failed! </h1>
    <p>Something went wrong.</p>
    <p>Please try again.</p>
  `);
});
router.post('/cancel', (req, res) => {
  res.status(200).send(`
    <h1>Payment canceled</h1>
    <p>Your payment was canceled.</p>
  `);
});

export default router;
