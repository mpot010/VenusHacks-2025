import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

function Welcome() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify(formData));
    navigate('/create');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundImage: 'url("https://ik.imagekit.io/3ks5fygi7/Screenshot%202025-05-23%20at%2011.43.30%20PM.png?updatedAt=1748069289817")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px'
      }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="form-container"
        autoComplete="off"
      >
        <h1 className="form-title">Welcome to LookBook!</h1>

        <label className="form-label" htmlFor="name">Name</label>
        <input 
          className={`form-input ${focusField === 'name' ? 'input-focus' : ''}`}
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          onFocus={() => setFocusField('name')} 
          onBlur={() => setFocusField(null)}
          placeholder="Name"
          required
        />

        <label className="form-label" htmlFor="email">Email</label>
        <input 
          className={`form-input ${focusField === 'email' ? 'input-focus' : ''}`}
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          onFocus={() => setFocusField('email')} 
          onBlur={() => setFocusField(null)}
          placeholder="you@example.com"
          required
        />

        <label className="form-label" htmlFor="age">Age</label>
        <input 
          className={`form-input ${focusField === 'age' ? 'input-focus' : ''}`}
          type="number" 
          id="age" 
          name="age" 
          value={formData.age} 
          onChange={handleChange} 
          onFocus={() => setFocusField('age')} 
          onBlur={() => setFocusField(null)}
          placeholder="Your age"
          min="0"
          required
        />

        <button type="submit" className="submit-btn">
          Get Started
        </button>
      </form>
    </div>
  );
}

export default Welcome;
