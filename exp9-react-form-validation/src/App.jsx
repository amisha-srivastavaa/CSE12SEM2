import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    setIsSuccess(false);
  };

  // Validation logic
  const validate = () => {
    let newErrors = {};
    let isValid = true;

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API call success
      setIsSuccess(true);
      setFormData({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Registration Form</h1>
        <p>Experiment 9: React Form Validation using <code>useState</code></p>
        <a href="../../index.html" className="back-link">Exit</a>
      </header>

      <div className="form-card">
        {isSuccess && (
          <div className="success-banner">
            Registration Successful! Welcome aboard.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error-input' : ''}
              placeholder="e.g. Jane Doe"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              placeholder="name@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
              placeholder="Min. 6 characters"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default App;
