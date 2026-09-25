export const mockFinanceSummary = {
  tournamentId: 'bgmi-weekend-12',
  totalCollected: 25000,
  totalRefunded: 2000,
  escrowBalance: 23000,
  prizePoolReserved: 15000,
  platformFee: 1250,
  organizerPayout: 6750,
  tournamentStatus: 'COMPLETED', // Use COMPLETED to show the Prize Distribution Panel
  paymentStatus: {
    confirmed: 48,
    pending: 2,
    failed: 1
  }
};

export const mockPrizePayouts = [
  {
    id: 'payout-1',
    position: '1st',
    teamName: 'Storm Squad',
    teamTag: 'STM',
    captainUsername: 'StormIGL',
    grossAmount: 7500,
    tdsAmount: 0,
    netAmount: 7500,
    status: 'Pending',
    detailsSubmitted: true,
    verificationStatus: 'Verified',
    payoutMethod: 'UPI',
    payoutMethodDetails: 'UPI ••••@okhdfcbank',
    detailsDeadline: '2024-07-20T23:59:59Z',
    completedAt: null
  },
  {
    id: 'payout-2',
    position: '2nd',
    teamName: 'Hydra Esports',
    teamTag: 'HYD',
    captainUsername: 'HydraCapt',
    grossAmount: 5000,
    tdsAmount: 0,
    netAmount: 5000,
    status: 'Failed',
    detailsSubmitted: true,
    verificationStatus: 'Verified',
    payoutMethod: 'Bank Transfer',
    payoutMethodDetails: '•••• •••• 4821',
    detailsDeadline: '2024-07-20T23:59:59Z',
    completedAt: null
  },
  {
    id: 'payout-3',
    position: '3rd',
    teamName: 'Phoenix Rising',
    teamTag: 'PHX',
    captainUsername: 'PhxCapt',
    grossAmount: 2500,
    tdsAmount: 0,
    netAmount: 2500,
    status: 'Pending',
    detailsSubmitted: false,
    verificationStatus: 'Not Submitted',
    payoutMethod: null,
    payoutMethodDetails: null,
    detailsDeadline: '2024-07-20T23:59:59Z',
    completedAt: null
  }
];

export const mockFinancialLedger = [
  {
    id: 'txn-101',
    date: '2024-07-16T14:30:00Z',
    type: 'Entry Fee',
    description: 'Entry Fee - Storm Squad',
    amount: 500,
    direction: 'Credit',
    status: 'Completed',
    reference: 'TXN-ENT-101'
  },
  {
    id: 'txn-102',
    date: '2024-07-16T14:35:00Z',
    type: 'Entry Fee',
    description: 'Entry Fee - Hydra Esports',
    amount: 500,
    direction: 'Credit',
    status: 'Completed',
    reference: 'TXN-ENT-102'
  },
  {
    id: 'txn-103',
    date: '2024-07-17T10:00:00Z',
    type: 'Refund',
    description: 'Refund - Phantom Troupe (Withdrawal)',
    amount: -500,
    direction: 'Debit',
    status: 'Completed',
    reference: 'TXN-REF-103'
  },
  {
    id: 'txn-104',
    date: '2024-07-20T18:00:00Z',
    type: 'Platform Fee',
    description: 'Platform Fee Deduction',
    amount: -1250,
    direction: 'Debit',
    status: 'Completed',
    reference: 'TXN-FEE-104'
  }
];
