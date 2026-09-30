import db from '../config/db.js';
import { runSlaMonitoringCycle } from '../services/automationEngine.js';

export async function getRules(req, res, next) {
  try {
    const rules = await db.workflowRule.findMany({
      orderBy: { createdAt: 'asc' }
    });
    const slaRules = await db.sLARule.findMany();
    res.json({ rules, slaRules });
  } catch (err) {
    next(err);
  }
}

export async function createRule(req, res, next) {
  try {
    const { name, trigger, condition, action, enabled } = req.body;
    const rule = await db.workflowRule.create({
      data: {
        name,
        trigger,
        condition,
        action,
        enabled: enabled ?? true
      }
    });
    res.status(201).json({ rule });
  } catch (err) {
    next(err);
  }
}

export async function updateRule(req, res, next) {
  try {
    const { id } = req.params;
    const { name, trigger, condition, action, enabled } = req.body;
    const rule = await db.workflowRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(trigger && { trigger }),
        ...(condition && { condition }),
        ...(action && { action }),
        ...(enabled !== undefined && { enabled })
      }
    });
    res.json({ rule });
  } catch (err) {
    next(err);
  }
}

export async function runAutomation(req, res, next) {
  try {
    const results = await runSlaMonitoringCycle();
    res.json({
      message: 'Automation cycle completed successfully.',
      timestamp: new Date().toISOString(),
      results
    });
  } catch (err) {
    next(err);
  }
}

export async function getLogs(req, res, next) {
  try {
    const { ticketId, limit } = req.query;
    const where = {};
    if (ticketId) where.ticketId = ticketId;

    const logs = await db.automationLog.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take: limit ? parseInt(limit, 10) : 50
    });

    res.json({ logs });
  } catch (err) {
    next(err);
  }
}
