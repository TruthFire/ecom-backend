import mysql from 'mysql';

export const db = mysql.createConnection({
  host: 'db-mysql-fra1-34081-do-user-13073081-0.b.db.ondigitalocean.com',
  user: 'doadmin',
  password: '',
  database: 'gamerbux',
  port: '25060',
  multipleStatements: true,
});
