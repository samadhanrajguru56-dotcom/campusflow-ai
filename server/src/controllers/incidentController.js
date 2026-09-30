import db from '../config/db.js';

export async function getIncidents(req, res, next) {
  try {
    const { status, category, location } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (location) where.location = { contains: location };

    const incidents = await db.incident.findMany({
      where,
      include: { tickets: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ incidents });
  } catch (err) {
    next(err);
  }
}

export async function getIncidentById(req, res, next) {
  try {
    const { id } = req.params;
    const incident = await db.incident.findUnique({
      where: { id },
      include: { tickets: true }
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ incident });
  } catch (err) {
    next(err);
  }
}

export async function mergeTicketsIntoIncident(req, res, next) {
  try {
    const { id } = req.params;
    const { ticketIds } = req.body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return res.status(400).json({ error: 'Must provide an array of ticketIds to merge.' });
    }

    const incident = await db.incident.findUnique({ where: { id } });
    if (!incident) {
      return res.status(404).json({ error: 'Master incident not found' });
    }

    for (const tId of ticketIds) {
      await db.ticket.update({
        where: { id: tId },
        data: { incidentId: id }
      });

      await db.automationLog.create({
        data: {
          ticketId: tId,
          action: 'MANUAL_INCIDENT_MERGE',
          status: 'SUCCESS',
          message: `Ticket merged into Master Incident ${incident.incidentNumber} (${incident.title}).`
        }
      });
    }

    const updated = await db.incident.update({
      where: { id },
      data: {
        affectedUsers: incident.affectedUsers + ticketIds.length
      },
      include: { tickets: true }
    });

    res.json({ message: 'Tickets successfully merged into incident.', incident: updated });
  } catch (err) {
    next(err);
  }
}

export async function updateIncident(req, res, next) {
  try {
    const { id } = req.params;
    const { status, priority, title, description } = req.body;

    const existing = await db.incident.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updated = await db.incident.update({
      where: { id },
      data: updateData,
      include: { tickets: true }
    });

    // If resolving master incident, also resolve all constituent tickets
    if (status === 'RESOLVED') {
      const tickets = await db.ticket.findMany({ where: { incidentId: id } });
      for (const t of tickets) {
        if (t.status !== 'RESOLVED' && t.status !== 'CLOSED') {
          await db.ticket.update({
            where: { id: t.id },
            data: { status: 'RESOLVED', resolvedAt: new Date().toISOString() }
          });
        }
      }
    }

    res.json({ message: 'Incident updated', incident: updated });
  } catch (err) {
    next(err);
  }
}
