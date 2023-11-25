import inquirer from 'inquirer';
import connection from './db/connection.js';

function startApp() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllRoles() {
  const query = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllEmployees() {
  const query = `
    SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'What is the name of the new department?'
    }
  ]).then(answer => {
    const query = 'INSERT INTO department SET ?';
    connection.query(query, { name: answer.newDepartment }, (err, res) => {
      if (err) throw err;
      console.log(`Department added successfully.`);
      startApp();
    });
  });
}

function addRole() {
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the new role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
        validate: value => !isNaN(value) || 'Please enter a number'
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'What is the department ID for this role?',
        validate: value => !isNaN(value) || 'Please enter a number'
      }
    ]).then(answer => {
      const query = 'INSERT INTO role SET ?';
      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      }, (err, res) => {
        if (err) throw err;
        console.log(`Role added successfully.`);
        startApp();
      });
    });
  }  

  function addEmployee() {
    inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: "What is the employee's first name?"
      },
      {
        name: 'lastName',
        type: 'input',
        message: "What is the employee's last name?"
      },
      {
        name: 'roleId',
        type: 'input',
        message: "What is the employee's role ID?",
        validate: value => !isNaN(value) || 'Please enter a number'
      },
      {
        name: 'managerId',
        type: 'input',
        message: "What is the employee's manager's ID? (Leave blank if no manager)",
        validate: value => value === '' || !isNaN(value) || 'Please enter a number'
      }
    ]).then(answer => {
      const query = 'INSERT INTO employee SET ?';
      const newEmployee = {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.roleId,
        manager_id: answer.managerId || null
      };
      connection.query(query, newEmployee, (err, res) => {
        if (err) throw err;
        console.log(`Employee added successfully.`);
        startApp();
      });
    });
  }

  function updateEmployeeRole() {
    inquirer.prompt([
      {
        name: 'employeeId',
        type: 'input',
        message: "Enter the ID of the employee you'd like to update:",
        validate: value => !isNaN(value) || 'Please enter a number'
      },
      {
        name: 'newRoleId',
        type: 'input',
        message: "Enter the new role ID for this employee:",
        validate: value => !isNaN(value) || 'Please enter a number'
      }
    ])
}
startApp()