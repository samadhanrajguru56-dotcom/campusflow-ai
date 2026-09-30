import db from '../config/db.js';

/**
 * Calculate due date based on priority SLA rules
 */
export async function calculateSlaDueDate(priority = 'MEDIUM') {
  const rules = await db.sLARule.findMany();
  const rule = rules.find(r => r.priority === priority && r.enabled);
  
  let hours = 24; // Default medium
  if (rule) {
    hours = rule.hours;
  } else {
    switch (priority) {
      case 'CRITICAL': hours = 2; break;
      case 'HIGH': hours = 6; break;
      case 'MEDIUM': hours = 24; break;
      case 'LOW': hours = 72; break;
    }
  }

  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + hours);
  return dueDate.toISOString();
}

/**
 * Execute automation pipeline for a newly created ticket
 */
export async function executeTicketCreatedAutomation(ticket, aiData = {}) {
  const logs = [];

  // Log Step 1: AI Understanding & Classification
  const log1 = await db.automationLog.create({
    data: {
      ticketId: ticket.id,
      action: 'AI_TRIAGE_AND_CLASSIFICATION',
      status: 'SUCCESS',
      message: `AI categorized ticket as ${ticket.category} with ${ticket.priority} priority. Urgency: ${ticket.urgency}. Impact: ${ticket.impact || 'Standard'}.`
    }
  });
  logs.push(log1);

  // Log Step 2: SLA Timer Attachment
  const log2 = await db.automationLog.create({
    data: {
      ticketId: ticket.id,
      action: 'SLA_DEADLINE_ESTABLISHED',
      status: 'SUCCESS',
      message: `Enforced dynamic SLA policy: ${ticket.priority} priority deadline set for ${new Date(ticket.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    }
  });
  logs.push(log2);

  // Log Step 3: Assignment & Notification
  if (ticket.assigneeId) {
    const assignee = await db.user.findUnique({ where: { id: ticket.assigneeId } });
    if (assignee) {
      await db.notification.create({
        data: {
          userId: assignee.id,
          ticketId: ticket.id,
          type: 'TASK_ASSIGNED',
          message: `New ${ticket.priority} task assigned: "${ticket.title}" at ${ticket.location}. SLA deadline: ${new Date(ticket.dueAt).toLocaleTimeString()}.`
        }
      });

      const log3 = await db.automationLog.create({
        data: {
          ticketId: ticket.id,
          action: 'STAFF_DISPATCH_AND_NOTIFICATION',
          status: 'SUCCESS',
          message: `Dispatched operational order to ${assignee.name} (${assignee.role}) via automated dispatch matrix.`
        }
      });
      logs.push(log3);
    }
  }

  // Notify Requester
  await db.notification.create({
    data: {
      userId: ticket.requesterId,
      ticketId: ticket.id,
      type: 'TICKET_ACKNOWLEDGED',
      message: `Your request "${ticket.title}" has been received and routed to ${ticket.departmentId ? 'the specialized department' : 'Campus Operations'}.`
    }
  });

  // Evaluate Custom Workflow Rules
  const rules = await db.workflowRule.findMany({ where: { enabled: true } });
  for (const rule of rules) {
    if (rule.trigger === 'TICKET_CREATED') {
      try {
        let conditionMet = false;
        if (rule.condition.includes('CRITICAL') && ticket.priority === 'CRITICAL') {
          conditionMet = true;
        } else if (rule.condition.includes('HIGH') && (ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL')) {
          conditionMet = true;
        }

        if (conditionMet) {
          const ruleLog = await db.automationLog.create({
            data: {
              ticketId: ticket.id,
              workflowRuleId: rule.id,
              action: `RULE_FIRED: ${rule.name}`,
              status: 'SUCCESS',
              message: `Condition [${rule.condition}] satisfied. Executed action: ${rule.action}`
            }
          });
          logs.push(ruleLog);
        }
      } catch (err) {
        console.error(`Error executing workflow rule ${rule.id}:`, err);
      }
    }
  }

  return logs;
}

/**
 * Periodic SLA monitoring engine
 * Evaluates 80% threshold and overdue breaches
 */
export async function runSlaMonitoringCycle() {
  const activeTickets = await db.ticket.findMany({
    where: {
      status: { in: ['OPEN', 'IN_PROGRESS'] }
    }
  });

  const now = new Date();
  const results = {
    checked: activeTickets.length,
    remindersSent: 0,
    escalatedCount: 0
  };

  for (const ticket of activeTickets) {
    if (!ticket.dueAt || !ticket.createdAt) continue;

    const createdAt = new Date(ticket.createdAt).getTime();
    const dueAt = new Date(ticket.dueAt).getTime();
    const current = now.getTime();
    const totalDuration = dueAt - createdAt;
    const elapsed = current - createdAt;

    if (totalDuration <= 0) continue;
    const percentage = elapsed / totalDuration;

    // Check SLA Breach (100% exceeded)
    if (current >= dueAt) {
      if (ticket.status !== 'ESCALATED') {
        // Escalate ticket
        await db.ticket.update({
          where: { id: ticket.id },
          data: { status: 'ESCALATED' }
        });

        // Record history
        await db.ticketHistory.create({
          data: {
            ticketId: ticket.id,
            action: 'AUTOMATIC_SLA_ESCALATION',
            oldValue: ticket.status,
            newValue: 'ESCALATED'
          }
        });

        // Automation Log
        await db.automationLog.create({
          data: {
            ticketId: ticket.id,
            action: 'SLA_BREACH_ESCALATION',
            status: 'WARNING',
            message: `Ticket ${ticket.ticketNumber} exceeded SLA by ${Math.round((current - dueAt) / (1000 * 60))} minutes. Auto-escalated to Campus Operations Admin.`
          }
        });

        // Notify Admins
        const admins = await db.user.findMany({ where: { role: 'ADMIN' } });
        for (const admin of admins) {
          await db.notification.create({
            data: {
              userId: admin.id,
              ticketId: ticket.id,
              type: 'SLA_BREACH',
              message: `⚠️ ESCALATION: Ticket ${ticket.ticketNumber} (${ticket.title}) at ${ticket.location} has breached SLA deadline!`
            }
          });
        }

        results.escalatedCount++;
      }
    }
    // Check 80% SLA Warning
    else if (percentage >= 0.8 && percentage < 1.0) {
      // Check if reminder already sent recently
      const existingWarning = await db.automationLog.findFirst({
        where: {
          ticketId: ticket.id,
          action: 'SLA_80_PERCENT_REMINDER'
        }
      });

      if (!existingWarning && ticket.assigneeId) {
        await db.notification.create({
          data: {
            userId: ticket.assigneeId,
            ticketId: ticket.id,
            type: 'SLA_WARNING',
            message: `⏰ 80% SLA Warning: Ticket "${ticket.title}" is approaching deadline (${Math.round((dueAt - current) / (1000 * 60))}m remaining).`
          }
        });

        await db.automationLog.create({
          data: {
            ticketId: ticket.id,
            action: 'SLA_80_PERCENT_REMINDER',
            status: 'SUCCESS',
            message: `SLA consumed 80% of window. Automated reminder dispatched to assignee.`
          }
        });

        results.remindersSent++;
      }
    }
  }

  return results;
}
