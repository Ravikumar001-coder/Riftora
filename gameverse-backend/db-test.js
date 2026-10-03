const mysql = require('mysql2/promise');

async function checkDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '826001',
    database: 'etms'
  });

  const [rows] = await connection.execute(
    'SELECT tournament_id, name, game_id, format_type, total_team_slots, teams_per_match, max_team_size, tournament_type FROM tournaments WHERE tournament_id = ?',
    ['e49b6e99-316a-4c41-bdce-7b2a41b85397']
  );
  
  console.log(JSON.stringify(rows[0], null, 2));

  if (rows[0] && rows[0].game_id) {
     const [gameRows] = await connection.execute('SELECT game_name FROM games WHERE game_id = ?', [rows[0].game_id]);
     console.log('Game:', gameRows[0]);
  }
  
  await connection.end();
}

checkDb().catch(console.error);
