import mysql from 'mysql';

export const db = mysql.createConnection({
  host: 'gamerbux.mysql.database.azure.com',
  user: 'gamerbux_user',
  password: '3MmEr8rl492^',
  database: 'gamerbux',
  multipleStatements: true,
});

//3MmEr8rl492^
