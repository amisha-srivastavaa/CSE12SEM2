/**
 * script.js
 * Contains custom JavaScript for initializing Bootstrap components
 * and adding simple interactive behaviors.
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize all Bootstrap Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 2. Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
            navbar.classList.remove('shadow-sm');
        } else {
            navbar.classList.add('shadow-sm');
            navbar.classList.remove('shadow');
        }
    });

    // 3. Simple form submission handler for the modal
    const signupForm = document.querySelector('#signupModal form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // In a real application, you would send this to a server.
            alert("Thank you for signing up! We'll be in touch soon.");
            
            // Close the modal
            const modalElement = document.getElementById('signupModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            
            // Reset form
            signupForm.reset();
        });
    }
});
