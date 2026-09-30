import db from '../config/db.js';
import {
  analyzeTicketRequest,
  detectDuplicateIncident,
  generateSmartAssignment
} from '../services/geminiService.js';
import {
  calculateSlaDueDate,
  executeTicketCreatedAutomation
} from '../services/automationEngine.js';

export async function createTicket(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      category: overrideCategory,
      priority: overridePriority,
      urgency: overrideUrgency,
      impact: overrideImpact,
      departmentId: overrideDeptId,
      assigneeId: overrideAssigneeId
    } = req.body;

    const requesterId = req.user.id;

    // 1. Run AI Request Understanding & Classification
    const fullText = `${title}. ${description}`;
    const aiAnalysis = await analyzeTicketRequest(fullText, location);

    const category = overrideCategory || aiAnalysis.category || 'MAINTENANCE';
    const priority = overridePriority || aiAnalysis.priority || 'MEDIUM';
    const urgency = overrideUrgency || aiAnalysis.urgency || 'MEDIUM';
    const impact = overrideImpact || aiAnalysis.impact || 'Standard campus operational impact';

    // 2. Check for Duplicate Incident
    const activeTickets = await db.ticket.findMany({
      where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } }
    });

    const duplicateCheck = await detectDuplicateIncident(
      { title, description, location, category },
      activeTickets
    );

    let incidentId = null;
    let duplicateMerged = false;

    if (duplicateCheck.isDuplicate && duplicateCheck.confidence >= 0.75) {
      duplicateMerged = true;
      const matched = activeTickets.find(t => t.id === duplicateCheck.matchedTicketId);
      
      if (matched && matched.incidentId) {
        // Link to existing master incident
        incidentId = matched.incidentId;
        const inc = await db.incident.findUnique({ where: { id: incidentId } });
        if (inc) {
          await db.incident.update({
            where: { id: incidentId },
            data: { affectedUsers: inc.affectedUsers + 1 }
          });
        }
      } else if (matched) {
        // Create new Master Incident grouping both
        const masterInc = await db.incident.create({
          data: {
            incidentNumber: `INC-${1000 + Math.floor(Math.random() * 9000)}`,
            title: duplicateCheck.suggestedMasterTitle || `${location} ${category} Outage`,
            description: `Grouped operational incident initiated from duplicate reports regarding ${location}.`,
            category,
            location,
            priority,
            status: 'IN_PROGRESS',
            masterTicketId: matched.id,
            affectedUsers: 2
          }
        });
        incidentId = masterInc.id;
        // Associate previous ticket as well
        await db.ticket.update({
          where: { id: matched.id },
          data: { incidentId: masterInc.id }
        });
      }
    }

    // 3. Resolve Department
    let departmentId = overrideDeptId;
    if (!departmentId) {
      const departments = await db.department.findMany();
      const matchedDept = departments.find(d =>
        d.name.toLowerCase().includes(aiAnalysis.department?.toLowerCase() || '') ||
        (aiAnalysis.department && aiAnalysis.department.toLowerCase().includes(d.name.toLowerCase()))
      );
      departmentId = matchedDept ? matchedDept.id : (departments[0]?.id || null);
    }

    // 4. Resolve Smart Assignee
    let assigneeId = overrideAssigneeId;
    if (!assigneeId && departmentId) {
      const staffMembers = await db.user.findMany({
        where: { role: 'STAFF', departmentId, isAvailable: true }
      });
      const smartAssign = await generateSmartAssignment(
        { title, category, priority, location, departmentId },
        staffMembers
      );
      assigneeId = smartAssign.recommendedStaffId || null;
    }

    // 5. Establish Dynamic SLA Due Date
    const dueAt = await calculateSlaDueDate(priority);

    // 6. Generate Sequential Ticket Number
    const count = await db.ticket.count();
    const ticketNumber = `TKT-${1000 + count + 1}`;

    // 7. Persist Ticket in Database
    const ticket = await db.ticket.create({
      data: {
        ticketNumber,
        title: title || aiAnalysis.title,
        description,
        category,
        priority,
        urgency,
        location,
        impact,
        status: 'OPEN',
        requesterId,
        departmentId,
        assigneeId,
        incidentId,
        aiGenerated: true,
        dueAt
      },
      include: {
        requester: true,
        assignee: true,
        department: true,
        incident: true
      }
    });

    // 8. Store AI Analysis Metadata
    const savedAiAnalysis = await db.aIAnalysis.create({
      data: {
        ticketId: ticket.id,
        category: aiAnalysis.category,
        priority: aiAnalysis.priority,
        urgency: aiAnalysis.urgency,
        impact: aiAnalysis.impact,
        department: aiAnalysis.department,
        suggestedAssignee: aiAnalysis.suggestedAssignee,
        suggestedAction: aiAnalysis.suggestedAction,
        reason: aiAnalysis.reason,
        confidence: aiAnalysis.confidence || 0.95
      }
    });

    // 9. Initial Ticket History Record
    await db.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        userId: requesterId,
        action: 'TICKET_CREATED',
        newValue: 'Status: OPEN, Priority: ' + priority
      }
    });

    // 10. Execute Automated Workflow Engine
    const automationLogs = await executeTicketCreatedAutomation(ticket, aiAnalysis);

    res.status(201).json({
      message: 'Ticket successfully created and automated.',
      ticket,
      aiAnalysis: savedAiAnalysis,
      duplicateCheck,
      duplicateMerged,
      automationLogs
    });
  } catch (err) {
    next(err);
  }
}

export async function getTickets(req, res, next) {
  try {
    const {
      search,
      category,
      priority,
      status,
      location,
      departmentId,
      assigneeId,
      requesterId,
      incidentId
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (requesterId) where.requesterId = requesterId;
    if (incidentId) where.incidentId = incidentId;
    if (location) where.location = { contains: location };

    let tickets = await db.ticket.findMany({
      where,
      include: {
        requester: true,
        assignee: true,
        department: true,
        incident: true,
        aiAnalysis: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q)
      );
    }

    res.json({ tickets, total: tickets.length });
  } catch (err) {
    next(err);
  }
}

export async function getTicketById(req, res, next) {
  try {
    const { id } = req.params;
    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        requester: true,
        assignee: true,
        department: true,
        incident: true,
        aiAnalysis: true,
        comments: true,
        history: true
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (err) {
    next(err);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const { id } = req.params;
    const {
      status,
      priority,
      category,
      departmentId,
      assigneeId,
      resolutionNote,
      location,
      title
    } = req.body;

    const existing = await db.ticket.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (location) updateData.location = location;
    if (title) updateData.title = title;

    if (status === 'RESOLVED' && existing.status !== 'RESOLVED') {
      updateData.resolvedAt = new Date().toISOString();
    } else if (status === 'CLOSED' && existing.status !== 'CLOSED') {
      updateData.closedAt = new Date().toISOString();
    }

    // Update due date if priority was overridden
    if (priority && priority !== existing.priority) {
      updateData.dueAt = await calculateSlaDueDate(priority);
    }

    const updated = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        requester: true,
        assignee: true,
        department: true,
        incident: true,
        aiAnalysis: true
      }
    });

    // Record History Audit
    const actionDesc = status && status !== existing.status
      ? `STATUS_CHANGED: ${existing.status} -> ${status}`
      : priority && priority !== existing.priority
      ? `PRIORITY_OVERRIDDEN: ${existing.priority} -> ${priority}`
      : assigneeId !== existing.assigneeId
      ? `REASSIGNED`
      : `TICKET_UPDATED`;

    await db.ticketHistory.create({
      data: {
        ticketId: id,
        userId: req.user.id,
        action: actionDesc,
        oldValue: JSON.stringify({ status: existing.status, priority: existing.priority, assigneeId: existing.assigneeId }),
        newValue: JSON.stringify(updateData)
      }
    });

    // If resolution note was provided, save as comment
    if (resolutionNote) {
      await db.comment.create({
        data: {
          ticketId: id,
          userId: req.user.id,
          message: `Resolution Note: ${resolutionNote}`
        }
      });
    }

    // Notify Requester on resolution
    if (status === 'RESOLVED') {
      await db.notification.create({
        data: {
          userId: existing.requesterId,
          ticketId: id,
          type: 'TICKET_RESOLVED',
          message: `Good news! Your ticket "${existing.title}" at ${existing.location} has been marked RESOLVED. Please verify.`
        }
      });
    }

    res.json({ message: 'Ticket updated successfully', ticket: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTicket(req, res, next) {
  try {
    const { id } = req.params;
    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Role verification: Admins can delete any, Students can only delete their own OPEN tickets
    if (req.user.role !== 'ADMIN' && (ticket.requesterId !== req.user.id || ticket.status !== 'OPEN')) {
      return res.status(403).json({ error: 'You are not authorized to delete this ticket.' });
    }

    await db.ticket.delete({ where: { id } });
    res.json({ message: 'Ticket deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const comment = await db.comment.create({
      data: {
        ticketId: id,
        userId: req.user.id,
        message
      }
    });

    // Notify other party
    const targetUserId = req.user.id === ticket.requesterId ? ticket.assigneeId : ticket.requesterId;
    if (targetUserId) {
      await db.notification.create({
        data: {
          userId: targetUserId,
          ticketId: id,
          type: 'NEW_COMMENT',
          message: `New message on ticket ${ticket.ticketNumber} from ${req.user.name}: "${message.slice(0, 50)}..."`
        }
      });
    }

    const hydratedComment = {
      ...comment,
      user: { id: req.user.id, name: req.user.name, role: req.user.role }
    };

    res.status(201).json({ comment: hydratedComment });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req, res, next) {
  try {
    const { id } = req.params;
    const comments = await db.comment.findMany({
      where: { ticketId: id }
    });

    const users = await db.user.findMany();
    const enriched = comments.map(c => ({
      ...c,
      user: users.find(u => u.id === c.userId) || { name: 'User', role: 'USER' }
    }));

    res.json({ comments: enriched });
  } catch (err) {
    next(err);
  }
}

export async function getTicketHistory(req, res, next) {
  try {
    const { id } = req.params;
    const history = await db.ticketHistory.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: 'desc' }
    });

    const users = await db.user.findMany();
    const enriched = history.map(h => ({
      ...h,
      user: users.find(u => u.id === h.userId) || { name: 'System Automation' }
    }));

    res.json({ history: enriched });
  } catch (err) {
    next(err);
  }
}
