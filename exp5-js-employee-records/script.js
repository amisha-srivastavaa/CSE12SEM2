// Array of Employee Objects
const employees = [
    { id: 101, name: "Alice Johnson", department: "IT", salary: 75000 },
    { id: 102, name: "Bob Smith", department: "Sales", salary: 48000 },
    { id: 103, name: "Carol White", department: "HR", salary: 52000 },
    { id: 104, name: "David Brown", department: "IT", salary: 82000 },
    { id: 105, name: "Eve Davis", department: "Finance", salary: 60000 },
    { id: 106, name: "Frank Miller", department: "Sales", salary: 45000 },
    { id: 107, name: "Grace Wilson", department: "Finance", salary: 95000 },
];

// DOM Elements
const tableBody = document.getElementById('employeeTableBody');
const emptyState = document.getElementById('emptyState');
const alertBox = document.getElementById('alertBox');
const deptSelect = document.getElementById('deptSelect');

// Buttons
const btnAll = document.getElementById('btnAll');
const btnFilterSalary = document.getElementById('btnFilterSalary');
const btnTotalPayout = document.getElementById('btnTotalPayout');
const btnAvgSalary = document.getElementById('btnAvgSalary');

// Initial Render
renderTable(employees);

// Event Listeners
btnAll.addEventListener('click', () => {
    setActiveButton(btnAll);
    hideAlert();
    renderTable(employees);
});

btnFilterSalary.addEventListener('click', () => {
    setActiveButton(btnFilterSalary);
    hideAlert();
    const filtered = employees.filter(emp => emp.salary > 50000);
    renderTable(filtered);
});

btnTotalPayout.addEventListener('click', () => {
    setActiveButton(btnTotalPayout);
    // Using reduce to calculate total
    const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
    showAlert(`Total Company Payout: $${total.toLocaleString()}`);
    renderTable(employees); // Show all
});

btnAvgSalary.addEventListener('click', () => {
    setActiveButton(btnAvgSalary);
    const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const avg = total / employees.length;
    showAlert(`Average Employee Salary: $${avg.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    renderTable(employees);
});

deptSelect.addEventListener('change', (e) => {
    // Remove active state from side buttons
    document.querySelectorAll('.sidebar nav button').forEach(b => b.classList.remove('active'));
    hideAlert();
    
    const dept = e.target.value;
    if (dept === "") {
        renderTable(employees);
        return;
    }
    
    const filtered = employees.filter(emp => emp.department === dept);
    renderTable(filtered);
    
    // Also show a count
    showAlert(`Found ${filtered.length} employee(s) in the ${dept} department.`);
});

// Helper Functions
function renderTable(data) {
    tableBody.innerHTML = ''; // Clear current
    
    if (data.length === 0) {
        tableBody.parentElement.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    tableBody.parentElement.classList.remove('hidden');
    emptyState.classList.add('hidden');

    data.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${emp.id}</td>
            <td style="font-weight: 500;">${emp.name}</td>
            <td><span style="background: #e8eaf6; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${emp.department}</span></td>
            <td>$${emp.salary.toLocaleString()}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function setActiveButton(btn) {
    document.querySelectorAll('.sidebar nav button').forEach(b => b.classList.remove('active'));
    deptSelect.value = ""; // Reset select
    btn.classList.add('active');
}

function showAlert(message) {
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
}

function hideAlert() {
    alertBox.classList.add('hidden');
}
