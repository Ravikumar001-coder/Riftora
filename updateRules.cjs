const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'gameverse-frontend', 'src', 'services', 'mockData.js');
let data = fs.readFileSync(mockDataPath, 'utf8');

const rulesData = `
export const exploreTournamentRules = {
  "bgmi-pro-championship": {
    metadata: {
      version: "1.2.0",
      lastUpdated: "2026-09-08T10:00:00Z",
      downloadUrl: "/downloads/rulebook_bgmi_pro.pdf"
    },
    sections: [
      {
        id: "general",
        title: "General Rules",
        blocks: [
          { type: 'paragraph', content: "Welcome to the BGMI PRO CHAMPIONSHIP. These rules govern all tournament play. By participating, players agree to follow all instructions from the Tournament Organizers." },
          { type: 'list', items: [
            "All matches are played on the latest version of BGMI.",
            "Tournament Organizers reserve the right to amend rules at any time.",
            "All decisions made by the Organizers are final."
          ]}
        ]
      },
      {
        id: "eligibility",
        title: "Eligibility Requirements",
        blocks: [
          { type: 'paragraph', content: "To participate in the tournament, all players must meet the following criteria:" },
          { type: 'list', items: [
            "Players must be at least 16 years of age.",
            "Players must be residents of India.",
            "Accounts must be level 40 or higher.",
            "No player may play for more than one team in this tournament."
          ]}
        ]
      },
      {
        id: "format",
        title: "Tournament Format",
        blocks: [
          { type: 'paragraph', content: "The tournament consists of three stages: Group Stage, Semi Finals, and Grand Finals." },
          { type: 'heading3', content: "Group Stage" },
          { type: 'paragraph', content: "32 teams are divided into 4 groups (A, B, C, D). Each group plays a Round Robin format. The top 4 teams from each group advance to the Semi Finals." },
          { type: 'heading3', content: "Semi Finals" },
          { type: 'paragraph', content: "16 teams play 6 matches. The top 8 teams advance." },
          { type: 'heading3', content: "Grand Finals" },
          { type: 'paragraph', content: "The final 8 teams play 12 matches over 2 days to determine the champion." }
        ]
      },
      {
        id: "scoring",
        title: "Scoring System",
        blocks: [
          { type: 'paragraph', content: "The official scoring system rewards both placement and eliminations." },
          { type: 'list', items: [
            "1st Place: 10 points",
            "2nd Place: 6 points",
            "3rd Place: 5 points",
            "4th Place: 4 points",
            "5th Place: 3 points",
            "6th Place: 2 points",
            "7th - 8th Place: 1 point",
            "9th - 16th Place: 0 points",
            "Each Elimination: 1 point"
          ]}
        ]
      },
      {
        id: "conduct",
        title: "Code of Conduct",
        blocks: [
          { type: 'paragraph', content: "All participants are expected to act professionally. Toxic behavior will not be tolerated." },
          { type: 'heading3', content: "Prohibited Behavior" },
          { type: 'list', items: [
            "Harassment of players or staff.",
            "Collusion or match-fixing.",
            "Account sharing.",
            "Exploiting game bugs."
          ]}
        ]
      },
      {
        id: "penalties",
        title: "Penalties",
        blocks: [
          { type: 'paragraph', content: "Violations of the rulebook will result in penalties at the discretion of the Organizers." },
          { type: 'table', 
            headers: ["Violation", "Action"],
            rows: [
              ["Minor Toxicity", "Warning"],
              ["Repeated Toxicity", "Point Deduction (10 pts)"],
              ["Account Sharing", "Disqualification"],
              ["Use of Cheats", "Permanent Ban"]
            ]
          }
        ]
      }
    ]
  }
};
`;

// It might exist as a simple array, so I will replace it.
const regex = /export const exploreTournamentRules = [\s\S]*?(?=export const exploreTournamentPrizes|$)/;
if (regex.test(data)) {
  data = data.replace(regex, rulesData);
  fs.writeFileSync(mockDataPath, data);
  console.log('Replaced exploreTournamentRules');
} else {
  fs.writeFileSync(mockDataPath, data + '\\n' + rulesData);
  console.log('Appended exploreTournamentRules');
}
