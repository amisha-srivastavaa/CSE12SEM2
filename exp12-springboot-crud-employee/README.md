# Experiment 12: Spring Boot CRUD API

This project demonstrates a full CRUD (Create, Read, Update, Delete) REST API using Spring Boot, Spring Data JPA, and an H2 in-memory database.

## Technologies Used
- Spring Web (`@RestController`)
- Spring Data JPA (`@Entity`, `@Repository`)
- H2 Database

## Architecture
- `Employee.java`: Entity class representing the database table.
- `EmployeeRepository.java`: Interface extending `JpaRepository` for database operations.
- `EmployeeService.java`: Contains business logic.
- `EmployeeController.java`: Exposes REST endpoints.

## How to Run
1. Open a terminal and navigate to this folder:
   ```bash
   cd exp12-springboot-crud-employee
   ```
2. Start the application:
   ```bash
   mvn spring-boot:run
   ```
3. The server starts on port `8080`.

## Endpoints to Test (Postman or curl)

**1. Add Employee (POST /employees)**
```bash
curl -X POST http://localhost:8080/employees \
-H "Content-Type: application/json" \
-d '{"name": "Alice Johnson", "salary": 75000, "department": "IT"}'
```

**2. Get All Employees (GET /employees)**
```bash
curl http://localhost:8080/employees
```

**3. Get Employee by ID (GET /employees/1)**
```bash
curl http://localhost:8080/employees/1
```

**4. Update Employee (PUT /employees/1)**
```bash
curl -X PUT http://localhost:8080/employees/1 \
-H "Content-Type: application/json" \
-d '{"name": "Alice Johnson", "salary": 80000, "department": "IT"}'
```

**5. Delete Employee (DELETE /employees/1)**
```bash
curl -X DELETE http://localhost:8080/employees/1
```

## H2 Database Console
You can view the database tables via the browser:
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (leave blank)
