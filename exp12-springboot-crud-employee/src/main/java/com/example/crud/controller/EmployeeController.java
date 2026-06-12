package com.example.crud.controller;

import com.example.crud.entity.Employee;
import com.example.crud.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    // POST /employees - Add employee
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return service.saveEmployee(employee);
    }

    // GET /employees - Get all employees
    @GetMapping
    public List<Employee> getAll() {
        return service.getAllEmployees();
    }

    // GET /employees/{id} - Get by ID
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return service.getEmployeeById(id);
    }

    // PUT /employees/{id} - Update employee
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return service.updateEmployee(id, employee);
    }

    // DELETE /employees/{id} - Delete employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        boolean isDeleted = service.deleteEmployee(id);
        if (isDeleted) {
            return "Employee with ID " + id + " deleted successfully.";
        } else {
            return "Employee not found.";
        }
    }
}
