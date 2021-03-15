use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Software'),
    ('Finance'),
    ('Secretarial');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Manager', 134000, 1),
    ('Salesperson', 70000, 1),
    ('Senior Developer', 110000, 2),
    ('Junior Developer', 65000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 100000, 3),
    ('Front Desk Manager', 80000, 4),
    ('Data Entry Clerk', 45000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Steve', 'Austin', 1, NULL),
    ('Bruno', 'Sanmartino', 2, 1),
    ('Ric', 'Flair', 3, NULL),
    ('Jimmy', 'Snuka', 4, 3),
    ('Chris', 'Jericho', 5, NULL),
    ('Marty', 'Janetti', 6, 5),
    ('John', 'Cena', 7, NULL),
    ('Randy', 'Savage', 8, 7);