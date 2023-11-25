import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username', // replace with your MySQL username, often 'root'
  password: 'your_password', // replace with your MySQL password
  database: 'employee_traker' // ensure this matches your database name
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the employee_traker database.');
});

export default connection;
