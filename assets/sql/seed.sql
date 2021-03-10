INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

SELECT * FROM departments;


INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Person", 800000.00, 1),
        ("Sales Lead", 100000.00, 1),
        ("Sales Manager", 150000.00, 1),
        ("Engineer", 120000.00, 2),
        ("Lead Engineer", 150000.00, 2),
        ("Engineering Manager", 170000.00, 2),
        ("Accountant", 100000.00, 3),
        ("Lawyer", 190000.00, 4),
        ("Legal Team Lead", 250000.00, 4);

SELECT * FROM roles;


INSERT INTO employees (first_name, last_name, role_id)
VALUES  ("Mark", "Hamill", 1),
        ("Sally", "Sales", 2),
        ("Lindsey", "Lohan", 3),
        ("Ada", "Lovelace", 6),
        ("Linus", "Torvalds", 5),
        ("Faris", "Kadir", 4),
        ("Alan", "Turing", 7),
        ("Joe", "Law", 8),
        ("Jane", "Law", 9);

SELECT * FROM employees;