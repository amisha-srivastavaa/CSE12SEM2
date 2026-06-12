# Experiment 11: Basic Spring Boot API

This project demonstrates how to build a simple RESTful API using Spring Boot. It uses the `@RestController` annotation and maps endpoints using `@GetMapping` and `@PostMapping`.

## Endpoints Provided

- `GET /api/welcome` → Returns a welcome string.
- `GET /api/student` → Returns a JSON object of a hardcoded student.
- `POST /api/student` → Accepts a JSON payload and returns a confirmation string.

## How to Run

1. Open a terminal and navigate to this folder:
   ```bash
   cd exp11-springboot-basic-api
   ```
2. Start the application using Maven (ensure Maven is installed):
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on port 8080.

## Testing the Endpoints (using curl or Postman)

**1. Test GET /welcome:**
```bash
curl http://localhost:8080/api/welcome
```

**2. Test GET /student:**
```bash
curl http://localhost:8080/api/student
```

**3. Test POST /student:**
```bash
curl -X POST http://localhost:8080/api/student \
-H "Content-Type: application/json" \
-d '{"id": 102, "name": "John Doe", "course": "Physics"}'
```
