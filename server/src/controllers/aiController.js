import db from '../config/db.js';
import {
  analyzeTicketRequest,
  detectDuplicateIncident,
  generateSmartAssignment,
  detectRecurringIssues,
  generateManagementReport
} from '../services/geminiService.js';

export async function analyze(req, res, next) {
  try {
    const { text, location } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt is required for AI analysis.' });
    }

    const result = await analyzeTicketRequest(text, location);
    res.json({ analysis: result });
  } catch (err) {
    next(err);
  }
}

export async function detectDuplicate(req, res, next) {
  try {
    const { title, description, location, category } = req.body;
    const activeTickets = await db.ticket.findMany({
      where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } }
    });

    const result = await detectDuplicateIncident(
      { title, description, location, category },
      activeTickets
    );

    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function priorityCheck(req, res, next) {
  try {
    const { text, location } = req.body;
    const analysis = await analyzeTicketRequest(text, location);
    res.json({
      priority: analysis.priority,
      urgency: analysis.urgency,
      impact: analysis.impact,
      reason: analysis.reason
    });
  } catch (err) {
    next(err);
  }
}

export async function assignmentCheck(req, res, next) {
  try {
    const { ticketId, category, location, departmentId } = req.body;
    let staff = [];

    if (departmentId) {
      staff = await db.user.findMany({ where: { role: 'STAFF', departmentId } });
    } else {
      staff = await db.user.findMany({ where: { role: 'STAFF' } });
    }

    const result = await generateSmartAssignment(
      { id: ticketId, category, location, department: { name: category } },
      staff
    );

    res.json({ assignment: result });
  } catch (err) {
    next(err);
  }
}

export async function generateReport(req, res, next) {
  try {
    const tickets = await db.ticket.findMany();
    const incidents = await db.incident.findMany();

    const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const overdueCount = tickets.filter(t => {
      if (t.status === 'RESOLVED' || t.status === 'CLOSED') return false;
      return t.dueAt && new Date(t.dueAt) < new Date();
    }).length;

    const mergedCount = tickets.filter(t => t.incidentId !== null).length;

    const stats = {
      totalRequests: tickets.length,
      openCount,
      resolvedCount,
      overdueCount,
      slaCompliance: `${Math.round(((tickets.length - overdueCount) / (tickets.length || 1)) * 100)}%`,
      mergedCount,
      avgResolutionHours: 4.2
    };

    const report = await generateManagementReport(tickets, incidents, stats);
    res.json({ report, stats });
  } catch (err) {
    next(err);
  }
}

export async function getInsights(req, res, next) {
  try {
    const tickets = await db.ticket.findMany();
    const existingInsights = await db.aIInsight.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Also run dynamic recurring check
    const recurringAnalysis = await detectRecurringIssues(tickets);

    res.json({
      insights: existingInsights,
      recurringAnalysis
    });
  } catch (err) {
    next(err);
  }
}
