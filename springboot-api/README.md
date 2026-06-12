# Spring Boot Student Management API

This is the backend RESTful API built for the Student Management Dashboard. It provides standard CRUD (Create, Read, Update, Delete) operations and utilizes an H2 in-memory database, making it exceptionally easy to run without any external database configuration.

## Technologies Used
- **Java 17**
- **Spring Boot 3**
- **Spring Data JPA**
- **Spring Web**
- **H2 Database**

## API Endpoints

| HTTP Method | Endpoint               | Description                 |
| ----------- | ---------------------- | --------------------------- |
| `GET`       | `/api/students`        | Retrieve all students       |
| `GET`       | `/api/students/{id}`   | Retrieve a student by ID    |
| `POST`      | `/api/students`        | Create a new student        |
| `PUT`       | `/api/students/{id}`   | Update an existing student  |
| `DELETE`    | `/api/students/{id}`   | Delete a student            |

## How to Run

### Option 1: Using Maven Command Line
1. Ensure you have Java 17+ installed.
2. Navigate to the `springboot-api` directory.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows, use `mvnw.cmd spring-boot:run`)*

### Option 2: Using an IDE
You can open this folder in IntelliJ IDEA, Eclipse, or VS Code and run `DemoApplication.java` directly.

## Testing Endpoints
Once the application is running (on `http://localhost:8080`), you can test the endpoints using Postman, Insomnia, or simple `curl` commands.

### Example: Create a Student (cURL)
```bash
curl -X POST http://localhost:8080/api/students \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com", "course": "Computer Science"}'
```

### Accessing the Database
The H2 Database console is enabled and can be accessed at:
- **URL:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL:** `jdbc:h2:mem:studentdb`
- **Username:** `sa`
- **Password:** `password`
