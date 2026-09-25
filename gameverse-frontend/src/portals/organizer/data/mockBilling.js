export const mockBillingData = {
  organizationSlug: 'hydra-esports',
  status: 'ACTIVE', // 'ACTIVE', 'TRIAL', 'PAST_DUE', 'CANCELED', 'EXPIRED'
  plan: {
    id: 'plan_pro',
    name: 'PRO',
    priceMonthly: 2999,
    priceYearly: 29990,
    currency: 'INR',
    billingCycle: 'MONTHLY',
    renewalDate: '2026-09-30T00:00:00Z',
    description: 'For growing tournament organizations.',
    trialEndsAt: null
  },
  usage: {
    tournaments: { current: 12, limit: 25 },
    members: { current: 18, limit: 50 },
    storage: { current: 6.4, limit: 20 },
    activeEvents: { current: 2, limit: 5 }
  },
  paymentMethod: {
    type: 'Visa',
    last4: '4242',
    expMonth: '09',
    expYear: '29'
  },
  billingInformation: {
    organizationName: 'Riftora Esports',
    email: 'billing@hydra-esports.com',
    country: 'India',
    taxId: ''
  },
  invoices: [
    {
      id: 'INV-2026-008',
      date: '2026-08-30T10:00:00Z',
      amount: 2999,
      currency: 'INR',
      status: 'Paid',
      period: 'Aug 2026'
    },
    {
      id: 'INV-2026-007',
      date: '2026-07-30T10:00:00Z',
      amount: 2999,
      currency: 'INR',
      status: 'Paid',
      period: 'Jul 2026'
    },
    {
      id: 'INV-2026-006',
      date: '2026-06-30T10:00:00Z',
      amount: 2999,
      currency: 'INR',
      status: 'Paid',
      period: 'Jun 2026'
    }
  ]
};

export const availablePlans = [
  {
    id: 'plan_free',
    name: 'FREE',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'INR',
    description: 'For individuals and small communities starting out.',
    features: [
      '3 active tournaments',
      '10 organization members',
      'Basic analytics',
      'Standard support'
    ],
    limits: {
      tournaments: 3,
      members: 10
    }
  },
  {
    id: 'plan_pro',
    name: 'PRO',
    priceMonthly: 2999,
    priceYearly: 29990,
    currency: 'INR',
    description: 'For growing tournament organizations.',
    features: [
      '25 active tournaments',
      '50 organization members',
      'Advanced analytics',
      'Command Center access',
      'Priority support'
    ],
    limits: {
      tournaments: 25,
      members: 50
    }
  },
  {
    id: 'plan_business',
    name: 'BUSINESS',
    priceMonthly: 7999,
    priceYearly: 79990,
    currency: 'INR',
    description: 'For professional esports organizations and agencies.',
    features: [
      'Unlimited tournaments',
      '200 organization members',
      'Advanced analytics',
      'Production tools',
      '24/7 Priority support'
    ],
    limits: {
      tournaments: Infinity,
      members: 200
    }
  }
];
