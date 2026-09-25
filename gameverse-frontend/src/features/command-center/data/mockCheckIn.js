export const mockCheckInMatches = [
  { id: 'm_4', title: 'Match 4', round: 'Round 2', group: 'Group A', status: 'Scheduled', teams: 16, players: 64, lobby: 'Lobby A', deadline: '19:45' },
  { id: 'm_5', title: 'Match 5', round: 'Round 2', group: 'Group B', status: 'Scheduled', teams: 16, players: 64, lobby: 'Lobby B', deadline: '20:15' },
];

export const mockCheckInTeams = [
  {
    id: 't_1',
    matchId: 'm_4',
    name: 'Team Phoenix',
    captain: 'Rahul Kumar',
    lobby: 'Lobby A',
    status: 'Checked In',
    lastActivity: '2 mins ago',
    players: [
      { id: 'p_1', name: 'Rahul Kumar', role: 'Captain', status: 'Ready', checkInTime: '19:35' },
      { id: 'p_2', name: 'Amit Singh', role: 'Player', status: 'Ready', checkInTime: '19:36' },
      { id: 'p_3', name: 'Karan Das', role: 'Player', status: 'Ready', checkInTime: '19:37' },
      { id: 'p_4', name: 'Vivek Sharma', role: 'Player', status: 'Ready', checkInTime: '19:38' }
    ]
  },
  {
    id: 't_2',
    matchId: 'm_4',
    name: 'Cyber Ninjas',
    captain: 'Arjun Reddy',
    lobby: 'Lobby A',
    status: 'Pending',
    lastActivity: '6 mins ago',
    players: [
      { id: 'p_5', name: 'Arjun Reddy', role: 'Captain', status: 'Ready', checkInTime: '19:30' },
      { id: 'p_6', name: 'Siddharth', role: 'Player', status: 'Ready', checkInTime: '19:31' },
      { id: 'p_7', name: 'Vikram', role: 'Player', status: 'Ready', checkInTime: '19:32' },
      { id: 'p_8', name: 'Kabir', role: 'Player', status: 'Not Ready', checkInTime: null }
    ]
  },
  {
    id: 't_3',
    matchId: 'm_4',
    name: 'Shadow Wolves',
    captain: 'Karan Mehra',
    lobby: 'Lobby A',
    status: 'Checked In',
    lastActivity: '1 min ago',
    players: [
      { id: 'p_9', name: 'Karan Mehra', role: 'Captain', status: 'Ready', checkInTime: '19:40' },
      { id: 'p_10', name: 'Rohan', role: 'Player', status: 'Ready', checkInTime: '19:40' },
      { id: 'p_11', name: 'Aditya', role: 'Player', status: 'Ready', checkInTime: '19:41' },
      { id: 'p_12', name: 'Sahil', role: 'Player', status: 'Ready', checkInTime: '19:41' }
    ]
  },
  {
    id: 't_4',
    matchId: 'm_4',
    name: 'Titan Esports',
    captain: 'Dev Patel',
    lobby: 'Lobby A',
    status: 'Checked In',
    lastActivity: '10 mins ago',
    players: [
      { id: 'p_13', name: 'Dev Patel', role: 'Captain', status: 'Ready', checkInTime: '19:20' },
      { id: 'p_14', name: 'Yash', role: 'Player', status: 'Ready', checkInTime: '19:22' },
      { id: 'p_15', name: 'Sameer', role: 'Player', status: 'Ready', checkInTime: '19:25' },
      { id: 'p_16', name: 'Armaan', role: 'Player', status: 'Ready', checkInTime: '19:28' }
    ]
  },
  {
    id: 't_5',
    matchId: 'm_4',
    name: 'Alpha Squad',
    captain: 'Tarun',
    lobby: 'Lobby A',
    status: 'Late',
    lastActivity: '15 mins ago',
    players: [
      { id: 'p_17', name: 'Tarun', role: 'Captain', status: 'Ready', checkInTime: '19:15' },
      { id: 'p_18', name: 'Mohit', role: 'Player', status: 'Not Ready', checkInTime: null },
      { id: 'p_19', name: 'Gaurav', role: 'Player', status: 'Not Ready', checkInTime: null },
      { id: 'p_20', name: 'Praveen', role: 'Player', status: 'Not Ready', checkInTime: null }
    ]
  }
];

// Pad out the rest of the 16 teams for Match 4 to make the mock realistic
for(let i = 6; i <= 16; i++) {
  mockCheckInTeams.push({
    id: `t_${i}`,
    matchId: 'm_4',
    name: `Team ${String.fromCharCode(64 + i)}`,
    captain: `Player ${i}A`,
    lobby: 'Lobby A',
    status: 'Checked In',
    lastActivity: `${i} mins ago`,
    players: [
      { id: `p_${i}1`, name: `Player ${i}A`, role: 'Captain', status: 'Ready', checkInTime: '19:30' },
      { id: `p_${i}2`, name: `Player ${i}B`, role: 'Player', status: 'Ready', checkInTime: '19:30' },
      { id: `p_${i}3`, name: `Player ${i}C`, role: 'Player', status: 'Ready', checkInTime: '19:30' },
      { id: `p_${i}4`, name: `Player ${i}D`, role: 'Player', status: 'Ready', checkInTime: '19:30' }
    ]
  });
}
