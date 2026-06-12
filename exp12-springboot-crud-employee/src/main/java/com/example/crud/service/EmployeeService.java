package com.example.crud.service;

import com.example.crud.entity.Employee;
import com.example.crud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    public Employee saveEmployee(Employee employee) {
        return repository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        Optional<Employee> opt = repository.findById(id);
        return opt.orElse(null);
    }

    public Employee updateEmployee(Long id, Employee empDetails) {
        Employee existing = getEmployeeById(id);
        if (existing != null) {
            existing.setName(empDetails.getName());
            existing.setSalary(empDetails.getSalary());
            existing.setDepartment(empDetails.getDepartment());
            return repository.save(existing);
        }
        return null;
    }

    public boolean deleteEmployee(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
