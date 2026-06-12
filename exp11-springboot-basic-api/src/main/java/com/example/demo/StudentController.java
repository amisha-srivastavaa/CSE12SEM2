package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class StudentController {

    // GET /api/welcome
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Student API (Experiment 11)";
    }

    // GET /api/student
    @GetMapping("/student")
    public Student getStudent() {
        // Return a hardcoded student object
        return new Student(101L, "Amisha Srivastava", "B.Tech CSE");
    }

    // POST /api/student
    @PostMapping("/student")
    public String saveStudent(@RequestBody Student student) {
        // Accepts a student object
        return "Student saved: " + student.getName() + " enrolled in " + student.getCourse();
    }
}
