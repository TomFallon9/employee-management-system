const inquirer = require("inquirer");
const mysql = require("mysql");
const { printTable } = require("console-table-printer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'T12omm12345',
    database: 'employees',
});

// function to prompt user for what they would like to do
const start = () => {
    inquirer
        .prompt({
            name: 'start',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all employees',
                'View all employees by department',
                'View all employees by manager',
                'Add employee',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'Quit'],
        })
        .then((answer) => {
            // after answer is made ".then((answer)" function followed by else ifs to direct user to where they want to go"
            if (answer.start === 'View all employees') {
                viewEmployee();
            }
            else if (answer.start === 'View all employees by department') {
                viewByDepartment();
            }
            else if (answer.start === 'View all employees by manager') {
                viewManager();
            }
            else if (answer.start === 'Add employee') {
                addEmployee();
            }
            else if (answer.start === 'View all roles') {
                viewRoles();
            }
            else if (answer.start === 'Add role') {
                addRole();
            }
            else if (answer.start === 'View all departments') {
                viewAllDepartments();
            }
            else if (answer.start === 'Add department') {
                addDepartment();
            }
            else {
                connection.end();
            }
        });
};
//  function to view table using table printer of the employee
const viewEmployee = () => {
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        printTable(data);
        start();
    }
    );
};

//view employee by department SELECT * from dept. data.map all depts.
const viewByDepartment = () => {
    connection.query('SELECT * FROM department', (err, data) => {
        const allDepartments = data.map((allDepartments) => {
            return {
                value: allDepartments.id,
                name: allDepartments.name
            }
        })
        if (err) throw err;
        inquirer.prompt({
            name: 'employByDept',
            type: 'list',
            message: 'What department would you like to view?',
            choices: allDepartments
        }).then((data) => {
            connection.query(`SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ${data.employByDept} ORDER BY department.name`, (err, data) => {
                if (err) throw err;
                printTable(data);
                start();
            });
        });
    });
};
//add new employee info, then connection.query INSERT INTO employee set to add
const addEmployee = () => {
    connection.query('SELECT * FROM role', (err, data) => {
        const allRoles = data.map((allRoles) => {
            return {
                value: allRoles.id,
                name: allRoles.title
            }
        });
        if (err) throw err;
        connection.query('SELECT CONCAT(first_name, " ", last_name) as \'name\', id FROM employee WHERE id in (select manager_id from employee)', (err, data) => {
            const allManagers = data.map((employee) => {
                return {
                    value: employee.id,
                    name: employee.name
                }
            });
            if (err) throw err;
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is employee\'s first name?',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'What is employee\'s last name?',
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is employee\'s role?',
                    choices: allRoles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is employee\'s manager?',
                    choices: allManagers
                }
            ]).then((data) => {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        role_id: data.role,
                        manager_id: data.manager,
                    },
                    (err) => {

                        if (err) throw err;
                        console.log('Employee has been added successfully!')

                        start();
                    }
                )
            });
        });
    });
};


const updateEmployeeRole = () => {
    connection.query('SELECT * FROM role', (err, data) => {
        const allRoles = data.map((allRoles) => {
            return {
                value: allRoles.id,
                name: allRoles.title
            }
        });
        if (err) throw err;
        connection.query('SELECT CONCAT(first_name, " ", last_name) as \'name\', id FROM employee', (err, data) => {
            const allEmployees = data.map((allEmployees) => {
                return {
                    value: allEmployees.id,
                    name: allEmployees.name,
                }
            })
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "updateEmployee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: allEmployees
                },
                {
                    name: "updateRole",
                    type: "list",
                    message: "What is the employee\'s new role?",
                    choices: allRoles
                },
            ]).then((data) => {
                connection.query(
                    `UPDATE employee set role_id=${data.updateRole} WHERE id=${data.updateEmployee}`);
                if (err) throw err;
                console.log('Employee role has been updated successfully!')

                start();
            });
        });
    });

};

// view all roles of employees
const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, data) => {
        if (err) throw err;
        printTable(data);
        start();
    }
    );
};

//add new role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, data) => {
        const allDepartments = data.map((allDepartments) => {
            return {
                value: allDepartments.id,
                name: allDepartments.name
            }
        })
        if (err) throw err;
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the role you would like to add?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary of the role you will add?"
            },
            {
                name: 'roleDepartment',
                type: 'list',
                message: 'Which department would you like to a add role to?',
                choices: allDepartments

            },
        ]).then((data) => {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: data.roleTitle,
                    salary: data.roleSalary,
                    department_id: data.roleDepartment
                },
                (err) => {

                    if (err) throw err;
                    console.log("Congrats, new role added!")

                    start();
                }
            )
        });
    });
};

// view all departments of employees
const viewAllDepartments = () => {
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        printTable(data);
        start();
    }
    );
};

//add a new department then connection.query INSERT INTO dept set? to add
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'What type of department would you like to add?',
        },
    ]).then((data) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: data.addDepartment
            },
            (error) => {

                if (error) throw error;
                console.log('Department has been added successfully!')

                start();
            }
        )
    });
};

connection.connect((err) => {
    if (err) throw err;
    // run  start function after connection to prompt user
    start();
});