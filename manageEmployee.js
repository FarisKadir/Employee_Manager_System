const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


//Connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Password1',
    database: 'employee_db',
  });

//Main menu. The user will see this menu when they start the application and when they complete any of the actions.
  const mainMenu = () =>  {
    inquirer.prompt([
        {
            pageSize: 15,
            type: "list",
            message: "What would you like to do?",
            choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    new inquirer.Separator(),
                    "View All Departments",
                    "Add Department",
                    new inquirer.Separator(),
                    "View All Roles",
                    "Add Role",
                    new inquirer.Separator(),
                    "View All Managers",
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
                updateEmp();
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
                addRole();
                break;
            case "View All Managers":
                viewAll("managers");
                break;
            case "Add Manager":
                addMgr();
                break;
            case "Nothing, I'm done":
                console.log("Thank you and have a great day!");
                connection.end();
                break;
        };
    });
  };


//Basic SELECT that will display all rows for a given table
const viewAll = (table) => {
    switch(table)   {
        case "departments":
        case "roles":
        case "managers":
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

//Function that allows the user to add an employee
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


//Function for updating an employee's role
const updateEmp = () =>    {
    const emp = [];
    const rol = [];

    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        res.forEach((thisObj) =>   {
            emp.push({"name": `${thisObj.first_name} ${thisObj.last_name}`, "value": thisObj.id})
        });
    });

    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        res.forEach((thisObj) =>   {
            rol.push({"name": thisObj.title, "value": thisObj.id});
        });
    });

    inquirer.prompt([
        {
            type:   "confirm",
            message: "Are you sure you want to change the role for this employee?",
            name: "confirm"
        },
        {
            type:   "list",
            message: "Which employee would you like to update?",
            choices: emp,
            name: "emp_id",
            when: "confirm"
        },
        {
            type:   "list",
            message: "What is their new role?",
            choices: rol,
            name: "role_id",
            when: "confirm"
        },
    ]).then((answers) => {
        connection.query(`
        UPDATE employees
        SET role_id = ${answers.role_id}
        WHERE id = ${answers.emp_id}
        `, (err,res) => {
                if (err) throw err;
                console.log(`We've updated the employee's role!`);
                mainMenu();
            });
        });
};



//Function for adding a new department
const addDept = () =>    {
    inquirer.prompt([
    {
        type:   "input",
        message: "What is the name of the department?",
        name: "dept_name"
    },
]).then((answers) => {
    connection.query(`
    INSERT INTO departments (name)
    VALUES ('${answers.dept_name}');`, (err,res) => {
            if (err) throw err;
            console.log("Your new department was added!");
            mainMenu();
        });
    });
};


//Function for adding a new Role
const addRole = () =>    {
    const depts = [];
    
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        res.forEach((thisObj) =>   {
            depts.push({"name": thisObj.name, "value": thisObj.id})
        });
    });

    inquirer.prompt([
    {
        type:   "input",
        message: "What is the name of the new role?",
        name: "title"
    },
    {
        type:   "input",
        message: "What does the new role pay?",
        name: "salary"
    },
    {
        type:   "list",
        message: "Which department should we assign to the new role?",
        name: "dept",
        choices: depts
    },
]).then((answers) => {
    connection.query(`
    INSERT INTO roles (title, salary, department_id)
    VALUES ('${answers.title}', '${answers.salary}','${answers.dept}' );`, (err,res) => {
            if (err) throw err;
            console.log("Your new role was added!");
            mainMenu();
        });
    });
};



//Runs the main menu
mainMenu();