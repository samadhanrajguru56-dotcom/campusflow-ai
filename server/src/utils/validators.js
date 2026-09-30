import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'FACULTY', 'STAFF', 'ADMIN']).default('STUDENT'),
  departmentId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  urgency: z.string().optional(),
  impact: z.string().optional(),
  departmentId: z.string().optional(),
  aiGenerated: z.boolean().optional()
});

export const updateTicketSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  urgency: z.string().optional(),
  impact: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']).optional(),
  departmentId: z.string().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  resolutionNote: z.string().optional()
});

export const commentSchema = z.object({
  message: z.string().min(1, 'Comment message cannot be empty')
});

export const workflowRuleSchema = z.object({
  name: z.string().min(3, 'Rule name is required'),
  trigger: z.string().min(2, 'Trigger is required'),
  condition: z.string().min(2, 'Condition is required'),
  action: z.string().min(2, 'Action is required'),
  enabled: z.boolean().default(true)
});

export const slaRuleSchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  hours: z.number().int().positive('Hours must be a positive integer'),
  enabled: z.boolean().default(true)
});
