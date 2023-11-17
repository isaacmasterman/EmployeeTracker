const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1', //localhost
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'employee_tracker'
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to the employee_tracker database.");
  displaySplashArt();
  mainMenu();
});

// Function to display ASCII art (Placeholder)
function displaySplashArt() {

  // Include your ASCII art here
    console.log("  _____                 _                          ____                           _              ");
    console.log("  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   / ___| ___ _ __   ___ _ __ __ _| |_ ___  _ __ ");
    console.log("  |  _| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \ | |  _ / _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|");
    console.log("  | |___| | | | | | |_) | | (_) | |_| |  __/  __/ | |_| |  __/ | | |  __/ | | (_| | || (_) | |   ");
    console.log("  |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___|  \____|\___|_| |_|\___|_|  \__,_|\__\___/|_|   ");
    console.log("                  |_|            |___/                                                           ");
    console.log("Welcome to Employee Tracker!");
    }

function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
      ]
    }
  ])
  .then(answers => {
    switch (answers.action) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Quit':
        connection.end();
        break;
      default:
        console.log(`Invalid action: ${answers.action}`);
        break;
    }
  })
  .catch(error => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.log("Error: ", error);
    }
  });
}

// View all functions

function viewAllEmployees() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.role_title AS title, 
        d.department_name AS department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN employee m ON e.manager_id = m.id
      INNER JOIN role r ON e.role_id = r.id
      INNER JOIN department d ON r.department_id = d.id;
    `;
  
    connection.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu(); // return to main menu after displaying
    });
  }

function viewAllDepartments() {
    const query = `SELECT id, department_name AS department FROM department`;

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

function viewAllRoles() {
    const query = `SELECT id, role_title, salary, department_id AS role FROM role`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

// Add functions

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the new department?',
    })
    .then(department => {
        const query = `INSERT INTO department (department_name) VALUES ('${department.department}')`

        connection.query(query, (err, results) => {
            if (err) throw err;
            console.log('Your department has been added')
            mainMenu();
        });
    });
}

function addRole() {
    connection.query('SELECT id, department_name FROM department', (err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does the role belong to?',
                choices: departments.map(department => ({
                    name: department.department_name,
                    value: department.id
                }))
            }
        ])
        .then(answers => {
            const query = `INSERT INTO role (role_title, salary, department_id) VALUES (?, ?, ?)`;
            connection.query(query, [answers.role, answers.salary, answers.department], (err, results) => {
                if (err) throw err;
                console.log('Your role has been added');
                mainMenu();
            });
        });
    });
}

function addEmployee() {
    connection.query('SELECT id, role_title FROM role', (err, roles) => {
        if (err) throw err;

        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee', (err, managers) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles.map(role => ({
                        name: role.role_title,
                        value: role.id
                    }))
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers.map(manager => ({
                        name: manager.manager,
                        value: manager.id
                    })).concat([{ name: 'None', value: null }])
                }
            ])
            .then(answers => {
                // Insert the new employee into the database
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                connection.query(query, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, results) => {
                    if (err) throw err;
                    console.log("Employee added successfully.");
                    mainMenu();
                });
            });
        });
    });
}

// update function