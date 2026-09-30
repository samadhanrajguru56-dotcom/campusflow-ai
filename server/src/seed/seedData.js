import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export async function seedDatabase(force = false) {
  const existingUsers = await db.user.findMany();
  if (existingUsers.length > 0 && !force) {
    console.log('[Seed] Database already contains data. Skipping re-seed.');
    return;
  }

  console.log('[Seed] Populating realistic Smart Campus demo data...');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Create Departments
  const departmentsData = [
    { id: 'dept-it', name: 'IT Support', description: 'Campus networks, lab computers, servers, smart classroom AV' },
    { id: 'dept-maint', name: 'Campus Maintenance', description: 'Civil infrastructure, plumbing, carpentry, building fixtures' },
    { id: 'dept-elec', name: 'Electrical & HVAC', description: 'Air conditioning, power distribution, solar inverters, lighting' },
    { id: 'dept-house', name: 'Housekeeping & Sanitation', description: 'Custodial services, waste management, deep sanitization' },
    { id: 'dept-admin', name: 'Campus Administration', description: 'Facility booking, student administrative requests, security passes' }
  ];

  for (const dept of departmentsData) {
    await db.department.create({ data: dept });
  }

  // 2. Create Users (1 Admin, 2 Managers/Faculty, 8 Staff/Students)
  const usersData = [
    // Admin
    {
      id: 'usr-admin',
      name: 'Dr. Sarah Mitchell',
      email: 'admin@campusflow.edu',
      passwordHash,
      role: 'ADMIN',
      departmentId: 'dept-admin',
      isAvailable: true
    },
    // Faculty / Managers
    {
      id: 'usr-fac-1',
      name: 'Prof. David Chen',
      email: 'david.chen@campusflow.edu',
      passwordHash,
      role: 'FACULTY',
      departmentId: 'dept-it',
      isAvailable: true
    },
    {
      id: 'usr-fac-2',
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@campusflow.edu',
      passwordHash,
      role: 'FACULTY',
      departmentId: 'dept-maint',
      isAvailable: true
    },
    // Staff / Technicians
    {
      id: 'usr-tech-1',
      name: 'Rajesh Kumar (Senior Network Eng)',
      email: 'rajesh.it@campusflow.edu',
      passwordHash,
      role: 'STAFF',
      departmentId: 'dept-it',
      isAvailable: true
    },
    {
      id: 'usr-tech-2',
      name: 'Marcus Brody (Hardware Specialist)',
      email: 'marcus.it@campusflow.edu',
      passwordHash,
      role: 'STAFF',
      departmentId: 'dept-it',
      isAvailable: true
    },
    {
      id: 'usr-tech-3',
      name: 'Carlos Mendez (Master Electrician)',
      email: 'carlos.elec@campusflow.edu',
      passwordHash,
      role: 'STAFF',
      departmentId: 'dept-elec',
      isAvailable: true
    },
    {
      id: 'usr-tech-4',
      name: 'Priya Sharma (Facilities Lead)',
      email: 'priya.maint@campusflow.edu',
      passwordHash,
      role: 'STAFF',
      departmentId: 'dept-maint',
      isAvailable: true
    },
    // Students
    {
      id: 'usr-stud-1',
      name: 'Aarav Patel',
      email: 'aarav.student@campusflow.edu',
      passwordHash,
      role: 'STUDENT',
      departmentId: null,
      isAvailable: true
    },
    {
      id: 'usr-stud-2',
      name: 'Zoe Washington',
      email: 'zoe.student@campusflow.edu',
      passwordHash,
      role: 'STUDENT',
      departmentId: null,
      isAvailable: true
    },
    {
      id: 'usr-stud-3',
      name: 'Vikram Malhotra',
      email: 'vikram.student@campusflow.edu',
      passwordHash,
      role: 'STUDENT',
      departmentId: null,
      isAvailable: true
    },
    {
      id: 'usr-stud-4',
      name: 'Maya Lin',
      email: 'maya.student@campusflow.edu',
      passwordHash,
      role: 'STUDENT',
      departmentId: null,
      isAvailable: true
    }
  ];

  for (const user of usersData) {
    await db.user.create({ data: user });
  }

  // 3. Create Master Incident for duplicate demonstration
  const masterIncident = await db.incident.create({
    data: {
      id: 'inc-1042',
      incidentNumber: 'INC-1042',
      title: 'Lab 3 Core Network & Wi-Fi Gateway Outage',
      description: 'Multiple concurrent student and faculty reports of packet drop and gateway failure in Lab 3 prior to CS practicals.',
      category: 'NETWORK',
      location: 'Lab 3, Computer Science Dept',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      affectedUsers: 45
    }
  });

  // 4. Create 32 Realistic Campus Tickets
  const now = new Date();
  
  // Helper to make past dates
  const daysAgo = (days, hours = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() - hours);
    return d.toISOString();
  };

  const hoursFrom = (baseIso, hours) => {
    const d = new Date(baseIso);
    d.setHours(d.getHours() + hours);
    return d.toISOString();
  };

  const rawTickets = [
    // Duplicate Cluster in Lab 3 (Linked to master incident INC-1042)
    {
      ticketNumber: 'TKT-1001',
      title: 'Wi-Fi not working in Lab 3',
      description: 'Wi-Fi signal drops constantly in Lab 3. We cannot connect our laptops.',
      category: 'NETWORK',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Lab 3, Computer Science Dept',
      impact: '40+ students unable to access remote cloud IDE',
      status: 'IN_PROGRESS',
      requesterId: 'usr-stud-1',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      incidentId: 'inc-1042',
      aiGenerated: true,
      createdAt: daysAgo(0, 3),
      dueAt: hoursFrom(daysAgo(0, 3), 6)
    },
    {
      ticketNumber: 'TKT-1002',
      title: 'Internet stopped working in Lab 3',
      description: 'Lab 3 ethernet and access point are completely down. Need urgent fix.',
      category: 'NETWORK',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Merged into master incident INC-1042',
      status: 'IN_PROGRESS',
      requesterId: 'usr-stud-2',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      incidentId: 'inc-1042',
      aiGenerated: true,
      createdAt: daysAgo(0, 2),
      dueAt: hoursFrom(daysAgo(0, 2), 6)
    },
    {
      ticketNumber: 'TKT-1003',
      title: 'Lab 3 network is down',
      description: 'Cannot ping default gateway from workstation bench B in Lab 3.',
      category: 'NETWORK',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Merged into master incident INC-1042',
      status: 'IN_PROGRESS',
      requesterId: 'usr-fac-1',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      incidentId: 'inc-1042',
      aiGenerated: true,
      createdAt: daysAgo(0, 1),
      dueAt: hoursFrom(daysAgo(0, 1), 6)
    },

    // Recurring historical incidents at Lab 3 (Establishing recurring trend)
    {
      ticketNumber: 'TKT-1004',
      title: 'Lab 3 Switch Packet Loss',
      description: 'Periodic disconnects observed during Operating Systems practical session.',
      category: 'NETWORK',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Lab sessions disrupted for 2 hours',
      status: 'RESOLVED',
      requesterId: 'usr-fac-1',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      createdAt: daysAgo(25),
      dueAt: hoursFrom(daysAgo(25), 24),
      resolvedAt: hoursFrom(daysAgo(25), 18)
    },
    {
      ticketNumber: 'TKT-1005',
      title: 'Lab 3 DHCP Allocation Timeout',
      description: 'Students failing to acquire IP addresses in Lab 3.',
      category: 'NETWORK',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Exam mock test delayed',
      status: 'RESOLVED',
      requesterId: 'usr-stud-3',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      createdAt: daysAgo(19),
      dueAt: hoursFrom(daysAgo(19), 6),
      resolvedAt: hoursFrom(daysAgo(19), 5)
    },
    {
      ticketNumber: 'TKT-1006',
      title: 'Lab 3 Wi-Fi Speed Throttling',
      description: 'Extreme latency exceeding 800ms when 30 machines run pip install.',
      category: 'NETWORK',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Slow downloads during laboratory exercises',
      status: 'RESOLVED',
      requesterId: 'usr-fac-1',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      createdAt: daysAgo(12),
      dueAt: hoursFrom(daysAgo(12), 24),
      resolvedAt: hoursFrom(daysAgo(12), 14)
    },
    {
      ticketNumber: 'TKT-1007',
      title: 'Lab 3 Router Reboot Required',
      description: 'Access point rebooted twice manually by lab assistant.',
      category: 'NETWORK',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Lab 3, Computer Science Dept',
      impact: 'Intermittent outages across 45 nodes',
      status: 'RESOLVED',
      requesterId: 'usr-tech-2',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      createdAt: daysAgo(6),
      dueAt: hoursFrom(daysAgo(6), 6),
      resolvedAt: hoursFrom(daysAgo(6), 4)
    },

    // CRITICAL Academic & Safety Tickets
    {
      ticketNumber: 'TKT-1008',
      title: 'Circuit Breaker Sparking in Physics Lab B',
      description: 'Audible electrical sparking and smoke smell from main distribution breaker panel.',
      category: 'ELECTRICAL',
      priority: 'CRITICAL',
      urgency: 'CRITICAL',
      location: 'Physics Lab B, Science Wing',
      impact: 'Severe life-safety & fire risk; entire wing evacuated',
      status: 'RESOLVED',
      requesterId: 'usr-fac-2',
      departmentId: 'dept-elec',
      assigneeId: 'usr-tech-3',
      createdAt: daysAgo(4, 2),
      dueAt: hoursFrom(daysAgo(4, 2), 2),
      resolvedAt: hoursFrom(daysAgo(4, 2), 1)
    },
    {
      ticketNumber: 'TKT-1009',
      title: 'Major Water Pipe Burst in Library Basement Archive',
      description: 'High-pressure clean water line ruptured; flooding archive book stacks.',
      category: 'WATER',
      priority: 'CRITICAL',
      urgency: 'CRITICAL',
      location: 'Central Library Basement Archive',
      impact: 'Critical historical manuscripts endangered',
      status: 'IN_PROGRESS',
      requesterId: 'usr-admin',
      departmentId: 'dept-maint',
      assigneeId: 'usr-tech-4',
      createdAt: daysAgo(0, 1),
      dueAt: hoursFrom(daysAgo(0, 1), 2)
    },

    // OVERDUE / ESCALATED Tickets
    {
      ticketNumber: 'TKT-1010',
      title: 'Classroom 204 Overhead Projector Lamp Burnout',
      description: 'Projector turns off with red temperature indicator after 2 minutes. Class scheduled.',
      category: 'EQUIPMENT',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Classroom 204, Academic Block B',
      impact: 'Lecturer unable to project architectural drawings to 70 students',
      status: 'ESCALATED',
      requesterId: 'usr-fac-1',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-2',
      createdAt: daysAgo(1, 4),
      dueAt: hoursFrom(daysAgo(1, 4), 6) // overdue by 22 hours
    },
    {
      ticketNumber: 'TKT-1011',
      title: 'Hostel Block C 3rd Floor Water Cooler Not Chilling',
      description: 'Compressor humming loudly but water dispensing at room temperature.',
      category: 'MAINTENANCE',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      location: 'Hostel Block C, 3rd Floor Corridor',
      impact: '80 resident students walking down two flights for drinking water',
      status: 'ESCALATED',
      requesterId: 'usr-stud-1',
      departmentId: 'dept-maint',
      assigneeId: 'usr-tech-4',
      createdAt: daysAgo(2),
      dueAt: hoursFrom(daysAgo(2), 24) // overdue by 24h
    },

    // Variety of Campus Operations Tickets
    {
      ticketNumber: 'TKT-1012',
      title: 'Auditorium Wireless Mic Interference',
      description: 'Loud static noise over PA system during rehearsals for Annual Tech Symposium.',
      category: 'EQUIPMENT',
      priority: 'HIGH',
      urgency: 'MEDIUM',
      location: 'Main Auditorium Sound Booth',
      impact: 'Keynote rehearsals halted',
      status: 'IN_PROGRESS',
      requesterId: 'usr-stud-4',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-2',
      createdAt: daysAgo(0, 4),
      dueAt: hoursFrom(daysAgo(0, 4), 6)
    },
    {
      ticketNumber: 'TKT-1013',
      title: 'Cafeteria Hand Sanitizer Dispensers Empty',
      description: 'All 4 automatic touchless dispensers at cafeteria entrance are dry.',
      category: 'CLEANING',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      location: 'Central Food Court Entrance',
      impact: 'Hygiene compliance risk during peak lunch rush',
      status: 'OPEN',
      requesterId: 'usr-stud-2',
      departmentId: 'dept-house',
      assigneeId: null,
      createdAt: daysAgo(0, 5),
      dueAt: hoursFrom(daysAgo(0, 5), 24)
    },
    {
      ticketNumber: 'TKT-1014',
      title: 'Classroom 108 Ceiling Fan Wobble and Squeak',
      description: 'Second row center ceiling fan vibrates excessively causing loud noise and hazard concern.',
      category: 'ELECTRICAL',
      priority: 'MEDIUM',
      urgency: 'LOW',
      location: 'Classroom 108, Block A',
      impact: 'Distracting acoustic noise during lectures',
      status: 'RESOLVED',
      requesterId: 'usr-fac-2',
      departmentId: 'dept-elec',
      assigneeId: 'usr-tech-3',
      createdAt: daysAgo(5),
      dueAt: hoursFrom(daysAgo(5), 24),
      resolvedAt: hoursFrom(daysAgo(5), 11)
    },
    {
      ticketNumber: 'TKT-1015',
      title: 'Biometric Attendance Scanner Offline at North Gate',
      description: 'Turnstile scanner displaying fatal communication error. Long student queue.',
      category: 'SECURITY',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'North Campus Main Turnstile',
      impact: 'Morning entry bottleneck for 400+ students',
      status: 'RESOLVED',
      requesterId: 'usr-admin',
      departmentId: 'dept-it',
      assigneeId: 'usr-tech-1',
      createdAt: daysAgo(3),
      dueAt: hoursFrom(daysAgo(3), 6),
      resolvedAt: hoursFrom(daysAgo(3), 2)
    },
    {
      ticketNumber: 'TKT-1016',
      title: 'Emergency Exit Door Bar Sticking in Seminar Hall',
      description: 'Panic push-bar on west exit door requires excessive force to unlatch.',
      category: 'MAINTENANCE',
      priority: 'HIGH',
      urgency: 'HIGH',
      location: 'Seminar Hall 1, Management Block',
      impact: 'Fire code safety violation',
      status: 'RESOLVED',
      requesterId: 'usr-fac-1',
      departmentId: 'dept-maint',
      assigneeId: 'usr-tech-4',
      createdAt: daysAgo(7),
      dueAt: hoursFrom(daysAgo(7), 6),
      resolvedAt: hoursFrom(daysAgo(7), 3)
    },
    {
      ticketNumber: 'TKT-1017',
      title: 'Chemistry Lab Fume Hood Exhaust Fan Inoperative',
      description: 'Blower not drawing air; hazardous vapor accumulation risk.',
      category: 'LAB',
      priority: 'CRITICAL',
      urgency: 'CRITICAL',
      location: 'Organic Chemistry Lab 201',
      impact: 'Lab practicals cancelled until negative pressure restored',
      status: 'RESOLVED',
      requesterId: 'usr-fac-2',
      departmentId: 'dept-elec',
      assigneeId: 'usr-tech-3',
      createdAt: daysAgo(9),
      dueAt: hoursFrom(daysAgo(9), 2),
      resolvedAt: hoursFrom(daysAgo(9), 1)
    },
    {
      ticketNumber: 'TKT-1018',
      title: 'Hostel Block A 1st Floor Restroom Faucet Leak',
      description: 'Continuous heavy dripping from sink faucet #3.',
      category: 'WATER',
      priority: 'LOW',
      urgency: 'LOW',
      location: 'Hostel Block A, Restroom 104',
      impact: 'Minor clean water wastage',
      status: 'RESOLVED',
      requesterId: 'usr-stud-3',
      departmentId: 'dept-maint',
      assigneeId: 'usr-tech-4',
      createdAt: daysAgo(8),
      dueAt: hoursFrom(daysAgo(8), 72),
      resolvedAt: hoursFrom(daysAgo(8), 36)
    },
    {
      ticketNumber: 'TKT-1019',
      title: 'Air Conditioning Failure in Server Room 1',
      description: 'Primary precision AC unit tripped; ambient server room temp reached 31°C.',
      category: 'ELECTRICAL',
      priority: 'CRITICAL',
      urgency: 'CRITICAL',
      location: 'Data Center Server Room 1',
      impact: 'Critical enterprise core servers facing thermal emergency shutdown',
      status: 'RESOLVED',
      requesterId: 'usr-tech-1',
      departmentId: 'dept-elec',
      assigneeId: 'usr-tech-3',
      createdAt: daysAgo(11),
      dueAt: hoursFrom(daysAgo(11), 2),
      resolvedAt: hoursFrom(daysAgo(11), 1)
    },
    {
      ticketNumber: 'TKT-1020',
      title: 'Chemical Spill Cleanup Required in Material Testing Lab',
      description: 'Non-hazardous glycerin and resin mixture spilled on testing bench.',
      category: 'CLEANING',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      location: 'Material Science Lab 102',
      impact: 'Bench unusable for mechanical pull tests',
      status: 'RESOLVED',
      requesterId: 'usr-fac-2',
      departmentId: 'dept-house',
      assigneeId: null,
      createdAt: daysAgo(14),
      dueAt: hoursFrom(daysAgo(14), 24),
      resolvedAt: hoursFrom(daysAgo(14), 4)
    },
    {
      ticketNumber: 'TKT-1021',
      title: 'Unused Storage Room Window Latch Replacement',
      description: 'South window in basement archives storage does not lock securely.',
      category: 'MAINTENANCE',
      priority: 'LOW',
      urgency: 'LOW',
      location: 'Old Administrative Archive Storage',
      impact: 'Zero academic impact; non-critical storage',
      status: 'OPEN',
      requesterId: 'usr-admin',
      departmentId: 'dept-maint',
      assigneeId: null,
      createdAt: daysAgo(1),
      dueAt: hoursFrom(daysAgo(1), 72)
    },
    {
      ticketNumber: 'TKT-1022',
      title: 'Sports Complex Basketball Court Floodlight Bulbs Out',
      description: 'Two halogen floodlights flickering and shutting off intermittently.',
      category: 'ELECTRICAL',
      priority: 'LOW',
      urgency: 'LOW',
      location: 'Outdoor Sports Complex, Court 1',
      impact: 'Evening basketball practice restricted to half court',
      status: 'IN_PROGRESS',
      requesterId: 'usr-stud-1',
      departmentId: 'dept-elec',
      assigneeId: 'usr-tech-3',
      createdAt: daysAgo(2),
      dueAt: hoursFrom(daysAgo(2), 72)
    }
  ];

  // Insert tickets and AI analysis
  for (const t of rawTickets) {
    const createdTicket = await db.ticket.create({
      data: {
        ticketNumber: t.ticketNumber,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        urgency: t.urgency,
        location: t.location,
        impact: t.impact,
        status: t.status,
        requesterId: t.requesterId,
        departmentId: t.departmentId,
        assigneeId: t.assigneeId,
        incidentId: t.incidentId || null,
        aiGenerated: t.aiGenerated || true,
        createdAt: t.createdAt,
        dueAt: t.dueAt,
        resolvedAt: t.resolvedAt || null
      }
    });

    // Seed AI Analysis record
    await db.aIAnalysis.create({
      data: {
        ticketId: createdTicket.id,
        category: t.category,
        priority: t.priority,
        urgency: t.urgency,
        impact: t.impact,
        department: departmentsData.find(d => d.id === t.departmentId)?.name || 'IT Support',
        suggestedAssignee: t.assigneeId ? usersData.find(u => u.id === t.assigneeId)?.name : 'On-Call Specialist',
        suggestedAction: `Diagnose ${t.category.toLowerCase()} hardware and restore SLA operational uptime.`,
        reason: `Automated smart classification based on location impact and academic schedule.`,
        confidence: 0.95
      }
    });

    // Seed comment on in-progress or resolved tickets
    if (t.status === 'RESOLVED' || t.status === 'IN_PROGRESS') {
      await db.comment.create({
        data: {
          ticketId: createdTicket.id,
          userId: t.assigneeId || 'usr-tech-1',
          message: t.status === 'RESOLVED' 
            ? 'Technician verified hardware operation on-site. Component replaced and telemetry confirmed normal.'
            : 'Diagnostic underway. Parts requested from central campus warehouse.'
        }
      });
    }
  }

  // 5. Seed AI Insights (including Lab 3 recurring detection)
  const insightsData = [
    {
      type: 'RECURRING_FAILURE',
      title: 'Lab 3 Network Infrastructure Instability Detected',
      description: 'Lab 3 has recorded 7 network and access point outages over the past 30 days, predominantly during high-density practical exam periods.',
      severity: 'CRITICAL',
      relatedLocation: 'Lab 3, Computer Science Dept'
    },
    {
      type: 'WORKLOAD_SKEW',
      title: 'IT Support Team Approaching Maximum Concurrency',
      description: 'IT Support department currently holds 48% of campus open tasks. Automated load rebalancing recommended.',
      severity: 'WARNING',
      relatedLocation: 'IT Operations Center'
    },
    {
      type: 'PREVENTIVE_OPPORTUNITY',
      title: 'Classroom 204 Projector Thermal Cycles Exceeded',
      description: 'Repeated high-temperature alerts indicate fan duct lint accumulation. Preventive filter cleaning will prevent full optical lamp blowout.',
      severity: 'INFO',
      relatedLocation: 'Classroom 204, Academic Block B'
    },
    {
      type: 'DUPLICATE_CONSOLIDATION',
      title: 'Smart Automation Saved 5.5 Hours via Incident Grouping',
      description: '3 concurrent tickets in Lab 3 were merged into master incident INC-1042, preventing triple technician dispatch.',
      severity: 'SUCCESS',
      relatedLocation: 'Lab 3, Computer Science Dept'
    }
  ];

  for (const ins of insightsData) {
    await db.aIInsight.create({ data: ins });
  }

  // 6. Seed Initial Notifications for demo accounts
  await db.notification.create({
    data: {
      userId: 'usr-admin',
      type: 'SLA_ALERT',
      message: '🚨 SLA ESCALATION: Ticket TKT-1010 (Classroom 204 Projector) has breached maximum SLA deadline.'
    }
  });

  await db.notification.create({
    data: {
      userId: 'usr-stud-1',
      type: 'INCIDENT_UPDATE',
      message: 'Your report regarding Lab 3 Wi-Fi was consolidated into Master Incident INC-1042. Technician dispatched.'
    }
  });

  console.log('[Seed] Database successfully seeded with 32 realistic tickets, 11 users, master incidents, SLA rules and AI insights.');
}
