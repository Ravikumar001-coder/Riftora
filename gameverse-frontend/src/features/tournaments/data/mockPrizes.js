export const mockPrizeData = {
  totalPrizePool: 100000,
  currency: '₹',
  prizes: [
    {
      id: 'p1',
      position: '1st Place',
      label: 'Champion',
      rewardType: 'Cash',
      amount: 50000,
      percentage: 50,
      displayOrder: 1,
      isCustom: false
    },
    {
      id: 'p2',
      position: '2nd Place',
      label: 'Runner-up',
      rewardType: 'Cash',
      amount: 25000,
      percentage: 25,
      displayOrder: 2,
      isCustom: false
    },
    {
      id: 'p3',
      position: '3rd Place',
      label: 'Third Place',
      rewardType: 'Cash',
      amount: 15000,
      percentage: 15,
      displayOrder: 3,
      isCustom: false
    },
    {
      id: 'p4',
      position: '4th Place',
      label: 'Fourth Place',
      rewardType: 'Cash',
      amount: 5000,
      percentage: 5,
      displayOrder: 4,
      isCustom: false
    }
  ],
  additionalRewards: [
    {
      id: 'ar1',
      position: 'MVP',
      label: 'MVP Award',
      rewardType: 'Physical',
      description: 'Gaming Headset',
      sponsor: 'Logitech',
      displayOrder: 1
    },
    {
      id: 'ar2',
      position: 'Best Clutch',
      label: 'Best Clutch',
      rewardType: 'Cash',
      amount: 5000,
      displayOrder: 2
    }
  ]
};
