import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ricosantangelo', // replace with your MySQL username, often 'root'
  password: 'Snowball2day!413', // replace with your MySQL password
  database: 'employee_tracker' // ensure this matches your database name
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the employee_traker database.');
});

export default connection;
