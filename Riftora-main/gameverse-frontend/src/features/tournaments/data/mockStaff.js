export const mockStaffData = [
  {
    id: 's_1',
    userId: 'u_101',
    name: 'Arun Kumar',
    email: 'arun@example.com',
    avatar: 'AK',
    role: 'Match Operator',
    status: 'Active',
    responsibilities: ['Match Control'],
    assignedAt: '2026-09-01T10:00:00Z',
    lastActive: '2 mins ago'
  },
  {
    id: 's_2',
    userId: 'u_102',
    name: 'Priya Singh',
    email: 'priya@example.com',
    avatar: 'PS',
    role: 'Scoring Operator',
    status: 'Active',
    responsibilities: ['Scoring', 'Result Entry'],
    assignedAt: '2026-09-02T11:30:00Z',
    lastActive: '8 mins ago'
  },
  {
    id: 's_3',
    userId: 'u_103',
    name: 'Rahul Das',
    email: 'rahul.das@example.com',
    avatar: 'RD',
    role: 'Dispute Moderator',
    status: 'Pending',
    responsibilities: ['Dispute Review'],
    assignedAt: '2026-09-08T09:15:00Z',
    lastActive: null
  },
  {
    id: 's_4',
    userId: 'u_104',
    name: 'Neha Sharma',
    email: 'neha@example.com',
    avatar: 'NS',
    role: 'Tournament Manager',
    status: 'Active',
    responsibilities: ['Tournament Operations', 'Check-in'],
    assignedAt: '2026-08-25T14:00:00Z',
    lastActive: '1 hour ago'
  }
];

export const mockAvailableUsers = [
  { id: 'u_201', name: 'Vikram Singh', email: 'vikram@example.com', avatar: 'VS' },
  { id: 'u_202', name: 'Sneha Gupta', email: 'sneha@example.com', avatar: 'SG' },
  { id: 'u_203', name: 'Rohan Mehta', email: 'rohan@example.com', avatar: 'RM' },
  { id: 'u_204', name: 'Aditi Verma', email: 'aditi@example.com', avatar: 'AV' },
  // Some users that are already assigned
  { id: 'u_101', name: 'Arun Kumar', email: 'arun@example.com', avatar: 'AK' }
];

export const STAFF_ROLES = [
  'Tournament Admin',
  'Tournament Manager',
  'Check-in Manager',
  'Match Operator',
  'Scoring Operator',
  'Dispute Moderator',
  'Observer'
];

export const STAFF_RESPONSIBILITIES = [
  'Check-in',
  'Match Control',
  'Scoring',
  'Result Entry',
  'Dispute Review',
  'Tournament Operations'
];
