import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import automationRoutes from './routes/automationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { runSlaMonitoringCycle } from './services/automationEngine.js';
import { seedDatabase } from './seed/seedData.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Header Protection
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CampusFlow AI Operations Engine',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0),
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server and Background Services (only in non-Vercel environments)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`=======================================================`);
    console.log(`🚀 CAMPUSFLOW AI SERVER RUNNING ON PORT ${PORT}`);
    console.log(`📍 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);

    // Auto-seed database if empty
    try {
      await seedDatabase(false);
    } catch (err) {
      console.error('[Startup] Seed verification error:', err.message);
    }

    // Periodic SLA Monitoring Engine (every 60 seconds)
    setInterval(async () => {
      try {
        await runSlaMonitoringCycle();
      } catch (err) {
        console.error('[Automation Scheduler] Cycle error:', err.message);
      }
    }, 60 * 1000);
    console.log('[Automation Engine] Background SLA monitor active (60s tick).');
  });
} else {
  // Ensure seed data is ready on serverless cold start
  seedDatabase(false).catch(err => console.error('[Serverless Startup] Seed error:', err.message));
}

export default app;
