-- Insert Sample Data into 'department'
INSERT INTO department (department_name) VALUES 
('Engineering'), 
('Finance'), 
('Legal'), 
('Sales');

-- Insert Sample Data into 'role'
INSERT INTO role (role_title, salary, department_id) VALUES 
('Sales Lead', 100000, 4), 
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

-- Assuming you have employees to add (adjust role_id and manager_id as appropriate)
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL), 
('Jane', 'Smith', 2, 1), 
('Emily', 'Jones', 3, 1);
