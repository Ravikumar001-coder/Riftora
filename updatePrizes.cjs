const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'gameverse-frontend', 'src', 'services', 'mockData.js');
let data = fs.readFileSync(mockDataPath, 'utf8');

const newPrizesData = `
export const exploreTournamentPrizes = {
  "bgmi-pro-championship": {
    currency: "INR",
    totalPrizePool: 100000,
    status: "FINALIZED",
    prizeTerms: "Prizes will be distributed within 30 days of the tournament concluding. All winners must complete verification processes and adhere to the official Code of Conduct.",
    distribution: [
      { id: "p1", place: "1st Place", amount: 50000, type: "cash", sponsor: null, description: "Champion's share" },
      { id: "p2", place: "2nd Place", amount: 25000, type: "cash", sponsor: null },
      { id: "p3", place: "3rd Place", amount: 10000, type: "cash", sponsor: null },
      { id: "p4", place: "4th-5th Place", amount: 5000, type: "cash", sponsor: null },
      { id: "p5", place: "6th-10th Place", amount: 1000, type: "cash", sponsor: null }
    ],
    specialAwards: [
      { id: "sa1", title: "MVP", amount: 5000, type: "cash", description: "Awarded to the player with the highest performance rating." },
      { id: "sa2", title: "Best Fragger", amount: 3000, type: "cash", description: "Awarded to the player with the most eliminations." }
    ],
    nonCashPrizes: [
      { id: "nc1", title: "Pro Gaming Headset", type: "hardware", sponsor: "Logitech G", description: "Awarded to the tournament MVP." },
      { id: "nc2", title: "Tournament Trophy", type: "physical", sponsor: null, description: "Official Championship Trophy." }
    ]
  }
};
`;

const regex = /export const exploreTournamentPrizes = [\s\S]*?(?=export const exploreTournamentTeams)/;
data = data.replace(regex, newPrizesData + '\\n');
fs.writeFileSync(mockDataPath, data);
console.log('Successfully updated exploreTournamentPrizes');
