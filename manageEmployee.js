const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const e = require('express');

//Connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Password1',
    database: 'employee_db',
  });

  const mainMenu = () =>  {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                    "View All Employees", //done
                    "Add Employee", //done
                    "Update Employee Role", //in progress
                    new inquirer.Separator(),
                    "View All Departments", //done
                    "Add Department", //in progress
                    new inquirer.Separator(),
                    "View All Roles", //done
                    "Add Role", //in progress
                    new inquirer.Separator(),
                    "View All Managers", //not started
                    "Add A Manager", //not started
                    new inquirer.Separator(),
                    "Nothing, I'm done",
                    new inquirer.Separator()
                ],
            name: "action"
        }
    ]).then((answers) => {
        switch(answers.action) {
            case "View All Employees":
                viewAll("employees");
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Update Employee Role":
                break;
            case "View All Departments":
                viewAll("departments");
                break;
            case "Add Department":
                addDept();
                break;
            case "View All Roles":
                viewAll("roles");
                break;
            case "Add Role":
                viewAll("roles");
                break;
            case "Nothing, I'm done":
                connection.end();
                console.log("Thank you and have a great day!");
        };
    });
  };


  //Basic SELECT that will display all rows for a given table
const viewAll = (table) => {
    switch(table)   {
        case "departments":
        case "roles":
            connection.query(`SELECT * FROM ${table}`, (err,res) => {
                if (err) throw err;
                console.table(res);
                mainMenu();
            });
            break;
        case "employees":
            connection.query(`
                    SELECT 
                    a.id AS Employee_ID,
                    a.first_name AS First_Name,
                    a.last_name AS Last_Name,
                    b.title AS Role,
                    b.salary AS Annual_Salary,
                    d.name AS Department_Name,
                    concat(c.first_name," ", c.last_name) AS Manager
                    
                    FROM Employees a
                    
                    INNER JOIN roles b
                    On a.role_id = b.id
                    INNER JOIN managers c
                    On a.manager_id = c.id
                    INNER JOIN departments d
                    On b.department_id = d.id
        `, (err,res) => {
                if (err) throw err;
                console.table(res);
                mainMenu();
            });
            break;
    };
};


const addEmp = () =>    {
    const managers = [];
    const roles = [];

    connection.query(`SELECT managers.id, first_name, last_name, title From managers INNER JOIN roles on managers.role_id = roles.id`, (err, res) => {
        if (err) throw err;
        res.forEach((thisObj) =>   {
            managers.push({"name": `${thisObj.title} - ${thisObj.first_name} ${thisObj.last_name}`, "value": thisObj.id})
        });
    });

    connection.query(`SELECT * From roles`, (err, res) => {
        if (err) throw err;
        res.forEach((thisObj) =>   {
            roles.push({"name": thisObj.title, "value": thisObj.id})
        });
    });
    inquirer.prompt([
    {
        type:   "input",
        message: "What is the employee's first name?",
        name: "first"
    },
    {
        type:   "input",
        message: "What is the employee's last name?",
        name: "last"
    },
    {
        type:   "list",
        message: "What is the employee's role?",
        name: "role_id",
        choices: roles
    },
    {
        type:   "list",
        message: "Who is the employee's manager?",
        name: "manager_id",
        choices: managers
    },
]).then((answers) => {
    connection.query(`
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('${answers.first}', '${answers.last}', ${answers.role_id}, ${answers.manager_id});`, (err,res) => {
            if (err) throw err;
            console.log("Your new employee was added!");
            mainMenu();
        });
    });
};

const updateEmp = (emp_id, role_id) =>  {
    connection.query(`
    UPDATE employees
    SET role_id = '${role_id}'
    WHERE id = '${emp_id}'
    `, (err,res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        });
};


const addDept = (name) =>   {
    connection.query(`
    INSERT INTO employees (name)
    VALUES (${name});
    `, (err,res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        });
};




const addRole = (title, salary, department_id) =>   {
    connection.query(`
    INSERT INTO roles (title, salary, department_id)
    VALUES (${title},${salary},${department_id});
    `, (err,res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        });
};




const test = () =>  {
    const managers = [];
    connection.query(`SELECT * From managers`, (err, res) => {
        if (err) throw err;
        console.log(res);
        res.forEach((thisObj) =>   {
            managers.push(`ID: ${thisObj.id} Name: ${thisObj.first_name} ${thisObj.first_name}`)
        });
        console.log(managers);
        connection.end();
    });
};

mainMenu();