// DOM Elements
const setupSection = document.getElementById('setupSection');
const inputSection = document.getElementById('inputSection');
const resultSection = document.getElementById('resultSection');

const numSubjectsInput = document.getElementById('numSubjects');
const startBtn = document.getElementById('startBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const marksInputsContainer = document.getElementById('marksInputsContainer');

const setupError = document.getElementById('setupError');
const inputError = document.getElementById('inputError');

// Global Variable to store number of subjects
let numberOfSubjects = 0;

// Event Listeners
startBtn.addEventListener('click', generateInputFields);
calculateBtn.addEventListener('click', calculateResults);
resetBtn.addEventListener('click', resetApp);

// Functions
function generateInputFields() {
    const num = parseInt(numSubjectsInput.value);
    
    // Validation
    if (isNaN(num) || num < 1 || num > 10) {
        setupError.classList.remove('hidden');
        return;
    }
    
    setupError.classList.add('hidden');
    numberOfSubjects = num;
    marksInputsContainer.innerHTML = ''; // Clear previous

    // Loop to create input fields dynamically
    for (let i = 1; i <= num; i++) {
        const group = document.createElement('div');
        group.className = 'subject-input-group';
        
        group.innerHTML = `
            <span>Subject ${i}</span>
            <input type="number" class="mark-input" min="0" max="100" placeholder="0-100">
        `;
        marksInputsContainer.appendChild(group);
    }

    // UI Transition
    setupSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
}

function calculateResults() {
    const inputs = document.querySelectorAll('.mark-input');
    let totalMarks = 0;
    let isValid = true;

    // Loop to extract marks and validate
    for (let i = 0; i < inputs.length; i++) {
        const mark = parseFloat(inputs[i].value);
        
        if (isNaN(mark) || mark < 0 || mark > 100) {
            isValid = false;
            break;
        }
        totalMarks += mark;
    }

    if (!isValid) {
        inputError.classList.remove('hidden');
        return;
    }

    inputError.classList.add('hidden');

    // Calculations
    const maxPossible = numberOfSubjects * 100;
    const average = totalMarks / numberOfSubjects;
    
    // Conditional logic for Grades
    let grade = 'F';
    let isPass = false;

    if (average >= 90) {
        grade = 'O (Outstanding)';
        isPass = true;
    } else if (average >= 80) {
        grade = 'A+ (Excellent)';
        isPass = true;
    } else if (average >= 70) {
        grade = 'A (Very Good)';
        isPass = true;
    } else if (average >= 60) {
        grade = 'B+ (Good)';
        isPass = true;
    } else if (average >= 50) {
        grade = 'B (Above Average)';
        isPass = true;
    } else if (average >= 40) {
        grade = 'C (Pass)';
        isPass = true;
    } else {
        grade = 'F (Fail)';
        isPass = false;
    }

    // Update DOM
    document.getElementById('resTotal').textContent = `${totalMarks} / ${maxPossible}`;
    document.getElementById('resAvg').textContent = `${average.toFixed(2)}%`;
    document.getElementById('resGrade').textContent = grade;
    
    const statusEl = document.getElementById('resStatus');
    statusEl.textContent = isPass ? 'PASSED' : 'FAILED';
    statusEl.className = isPass ? 'status-pass font-bold' : 'status-fail font-bold';

    // UI Transition
    inputSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

function resetApp() {
    numSubjectsInput.value = '';
    resultSection.classList.add('hidden');
    setupSection.classList.remove('hidden');
}
