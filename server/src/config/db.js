import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create data directory:', e.message);
}

// Initial state container
let memoryStore = {
  users: [],
  departments: [],
  tickets: [],
  incidents: [],
  aiAnalyses: [],
  ticketHistories: [],
  comments: [],
  notifications: [],
  slaRules: [
    { id: 'sla-1', priority: 'CRITICAL', hours: 2, enabled: true },
    { id: 'sla-2', priority: 'HIGH', hours: 6, enabled: true },
    { id: 'sla-3', priority: 'MEDIUM', hours: 24, enabled: true },
    { id: 'sla-4', priority: 'LOW', hours: 72, enabled: true }
  ],
  workflowRules: [
    {
      id: 'wf-1',
      name: 'Critical Incident Rapid Triage',
      trigger: 'TICKET_CREATED',
      condition: "priority === 'CRITICAL'",
      action: 'Assign to department head, set 2h SLA, send emergency SMS & dashboard alert',
      enabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'wf-2',
      name: 'Pre-SLA Expiry Proactive Alert (80%)',
      trigger: 'SLA_80_PERCENT',
      condition: "status !== 'RESOLVED' && status !== 'CLOSED'",
      action: 'Send urgent reminder to assignee & update task risk indicator to AT_RISK',
      enabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'wf-3',
      name: 'SLA Breach Auto-Escalation',
      trigger: 'SLA_BREACHED',
      condition: "status !== 'RESOLVED' && status !== 'CLOSED'",
      action: 'Mark OVERDUE, escalate ticket to Campus Operations Director & raise priority',
      enabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'wf-4',
      name: 'Duplicate Incident Auto-Merge',
      trigger: 'DUPLICATE_DETECTED',
      condition: 'confidence >= 0.85',
      action: 'Merge into master incident, increment affected users count, notify requesters',
      enabled: true,
      createdAt: new Date().toISOString()
    }
  ],
  automationLogs: [],
  aiInsights: [],
  attachments: []
};

// Load saved data if available
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      memoryStore = { ...memoryStore, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load local store.json, using in-memory state:', err.message);
  }
}

function persistStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store.json:', err.message);
  }
}

loadStore();

// Generic collection builder supporting Prisma query interfaces
function createCollection(collectionKey) {
  return {
    async findMany(args = {}) {
      let items = [...(memoryStore[collectionKey] || [])];
      
      // Filter by `where`
      if (args.where) {
        items = items.filter(item => {
          for (const [key, val] of Object.entries(args.where)) {
            if (val === undefined) continue;
            if (typeof val === 'object' && val !== null) {
              if (val.in && Array.isArray(val.in)) {
                if (!val.in.includes(item[key])) return false;
              } else if (val.not !== undefined) {
                if (item[key] === val.not) return false;
              } else if (val.contains !== undefined) {
                const str = String(item[key] || '').toLowerCase();
                if (!str.includes(String(val.contains).toLowerCase())) return false;
              }
            } else if (item[key] !== val) {
              return false;
            }
          }
          return true;
        });
      }

      // Sort by `orderBy`
      if (args.orderBy) {
        const orderKey = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[orderKey] === 'desc' ? -1 : 1;
        items.sort((a, b) => {
          if (a[orderKey] > b[orderKey]) return direction;
          if (a[orderKey] < b[orderKey]) return -direction;
          return 0;
        });
      }

      // Skip & Take (pagination)
      if (args.skip) items = items.slice(args.skip);
      if (args.take) items = items.slice(0, args.take);

      // Hydrate includes for relations
      if (args.include) {
        items = items.map(item => hydrateItem(collectionKey, item, args.include));
      }

      return structuredClone(items);
    },

    async findUnique(args = {}) {
      if (!args.where) return null;
      const items = memoryStore[collectionKey] || [];
      const item = items.find(it => {
        for (const [key, val] of Object.entries(args.where)) {
          if (it[key] !== val) return false;
        }
        return true;
      });

      if (!item) return null;
      if (args.include) {
        return structuredClone(hydrateItem(collectionKey, item, args.include));
      }
      return structuredClone(item);
    },

    async findFirst(args = {}) {
      const results = await this.findMany({ ...args, take: 1 });
      return results.length > 0 ? results[0] : null;
    },

    async create(args = {}) {
      const data = args.data || {};
      const id = data.id || `${collectionKey.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date();
      const newItem = {
        id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        ...data
      };

      if (!memoryStore[collectionKey]) memoryStore[collectionKey] = [];
      memoryStore[collectionKey].push(newItem);
      persistStore();

      if (args.include) {
        return structuredClone(hydrateItem(collectionKey, newItem, args.include));
      }
      return structuredClone(newItem);
    },

    async update(args = {}) {
      if (!args.where) throw new Error('Missing where clause in update');
      const items = memoryStore[collectionKey] || [];
      const index = items.findIndex(it => {
        for (const [key, val] of Object.entries(args.where)) {
          if (it[key] !== val) return false;
        }
        return true;
      });

      if (index === -1) throw new Error(`Record not found in ${collectionKey}`);

      const updated = {
        ...items[index],
        ...args.data,
        updatedAt: new Date().toISOString()
      };
      items[index] = updated;
      persistStore();

      if (args.include) {
        return structuredClone(hydrateItem(collectionKey, updated, args.include));
      }
      return structuredClone(updated);
    },

    async updateMany(args = {}) {
      const items = memoryStore[collectionKey] || [];
      let count = 0;
      items.forEach(it => {
        let match = true;
        if (args.where) {
          for (const [key, val] of Object.entries(args.where)) {
            if (it[key] !== val) {
              match = false;
              break;
            }
          }
        }
        if (match) {
          Object.assign(it, args.data, { updatedAt: new Date().toISOString() });
          count++;
        }
      });
      persistStore();
      return { count };
    },

    async delete(args = {}) {
      if (!args.where) throw new Error('Missing where clause in delete');
      const items = memoryStore[collectionKey] || [];
      const index = items.findIndex(it => {
        for (const [key, val] of Object.entries(args.where)) {
          if (it[key] !== val) return false;
        }
        return true;
      });
      if (index === -1) throw new Error(`Record not found in ${collectionKey}`);
      const removed = items.splice(index, 1)[0];
      persistStore();
      return structuredClone(removed);
    },

    async count(args = {}) {
      const results = await this.findMany(args);
      return results.length;
    }
  };
}

// Hydrate relations in memory mode
function hydrateItem(type, item, include) {
  const result = { ...item };
  if (type === 'tickets') {
    if (include.requester) {
      result.requester = memoryStore.users.find(u => u.id === item.requesterId) || null;
    }
    if (include.assignee) {
      result.assignee = memoryStore.users.find(u => u.id === item.assigneeId) || null;
    }
    if (include.department) {
      result.department = memoryStore.departments.find(d => d.id === item.departmentId) || null;
    }
    if (include.incident) {
      result.incident = memoryStore.incidents.find(i => i.id === item.incidentId) || null;
    }
    if (include.aiAnalysis) {
      result.aiAnalysis = memoryStore.aiAnalyses.find(a => a.ticketId === item.id) || null;
    }
    if (include.comments) {
      const comments = memoryStore.comments.filter(c => c.ticketId === item.id);
      result.comments = comments.map(c => ({
        ...c,
        user: memoryStore.users.find(u => u.id === c.userId) || { name: 'User' }
      }));
    }
    if (include.history) {
      const history = memoryStore.ticketHistories.filter(h => h.ticketId === item.id);
      result.history = history.map(h => ({
        ...h,
        user: memoryStore.users.find(u => u.id === h.userId) || { name: 'System' }
      }));
    }
  } else if (type === 'incidents') {
    if (include.tickets) {
      result.tickets = memoryStore.tickets.filter(t => t.incidentId === item.id);
    }
  } else if (type === 'users') {
    if (include.department) {
      result.department = memoryStore.departments.find(d => d.id === item.departmentId) || null;
    }
  }
  return result;
}

// Database client export
export const db = {
  user: createCollection('users'),
  department: createCollection('departments'),
  ticket: createCollection('tickets'),
  incident: createCollection('incidents'),
  aIAnalysis: createCollection('aiAnalyses'),
  ticketHistory: createCollection('ticketHistories'),
  comment: createCollection('comments'),
  notification: createCollection('notifications'),
  sLARule: createCollection('slaRules'),
  workflowRule: createCollection('workflowRules'),
  automationLog: createCollection('automationLogs'),
  aIInsight: createCollection('aiInsights'),
  attachment: createCollection('attachments'),
  
  // Helper for resetting / seeding
  _getRawStore: () => memoryStore,
  _setRawStore: (newStore) => {
    memoryStore = newStore;
    persistStore();
  }
};

export default db;
