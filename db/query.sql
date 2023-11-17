-- View all employees
SELECT 
  e.id, 
  e.first_name, 
  e.last_name, 
  r.title, 
  d.department_name AS department,
  r.salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
INNER JOIN role r ON e.role_id = r.id
INNER JOIN department d ON r.department_id = d.id;

-- view all roles
SELECT 
  r.id, 
  r.title, 
  d.department_name AS department, 
  r.salary
FROM role r
INNER JOIN department d ON r.department_id = d.id;

-- View all departments
SELECT * FROM department;
