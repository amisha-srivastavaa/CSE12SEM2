package com.example.crud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrudApplication {
    public static void main(String[] args) {
        SpringApplication.run(CrudApplication.class, args);
        System.out.println("Experiment 12: Spring Boot CRUD API is running on port 8080");
        System.out.println("Access H2 Database console at: http://localhost:8080/h2-console");
    }
}
