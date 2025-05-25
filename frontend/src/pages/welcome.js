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
        backgroundImage: 'url("https://docs.google.com/drawings/d/e/2PACX-1vR5uxyWiN28vq53ArFSBhbT5l1mukfOQGYRG75S8KvyMQT8-xGA75eYbqRsHWxqFwdW5Gq9GiS-Qc_s/pub?w=1440&h=1080")',
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
        <h1 className="form-title">Welcome to LookBook</h1>

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
