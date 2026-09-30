import db from '../config/db.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await db.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ notifications, unreadCount: notifications.filter(n => !n.read).length });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await db.notification.update({
      where: { id },
      data: { read: true }
    });
    res.json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const result = await db.notification.updateMany({
      where: { userId: req.user.id },
      data: { read: true }
    });
    res.json({ message: 'All notifications marked as read', count: result.count });
  } catch (err) {
    next(err);
  }
}
