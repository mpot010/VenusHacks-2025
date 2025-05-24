import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Look() {
  const navigate = useNavigate();

  const occasionOptions = ['wedding', 'beach', 'hangout', 'meeting', 'other', 'none'];
  const budgetOptions = ['under $50', '$50 to $75', '$75 to $100', '$100 to $150', 'more than $150'];

  const [profile, setProfile] = useState({
    occasions: [],
    budget: [],
    location: '',
    date: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('glamProfile');
    if (savedProfile) {
      setProfile(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
    }
  }, []);

  const toggleOption = (category, value) => {
    setProfile(prev => {
      const selected = new Set(prev[category] || []);
      selected.has(value) ? selected.delete(value) : selected.add(value);
      return { ...prev, [category]: [...selected] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('glamProfile')) || {};
    const combinedProfile = { ...saved, ...profile };
  
    try {
      const response = await fetch('http://localhost:5001/generate-look', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(combinedProfile)
      });
  
      const result = await response.json();
  
      if (response.ok && result.status === 'success') {
        localStorage.setItem('recommendation', result.recommendation);
        navigate('/routine');
      } else {
        alert('Failed to generate look: ' + (result.message || 'unknown error'));
      }
    } catch (err) {
      console.error("Error calling backend:", err);
      alert('Server error. Please try again.');
    }
  };
  

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #fff0f6, #ffe6f0)',
      boxShadow: '0 8px 20px rgba(255, 182, 193, 0.25)',
      fontFamily: "'Segoe UI', sans-serif",
      color: '#5a3e49'
    },
    section: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    button: {
      padding: '10px 16px',
      margin: '6px',
      borderRadius: '20px',
      border: '1px solid #ffb6c1',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontWeight: '500',
      transition: '0.2s'
    },
    buttonActive: {
      backgroundColor: '#ff6fa3',
      color: '#fff',
      border: '1px solid #ff6fa3'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      marginTop: '0.5rem',
      fontSize: '1rem'
    },
    submit: {
      marginTop: '1.5rem',
      padding: '12px 24px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '30px',
      backgroundColor: '#ff6fa3',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    navButton: {
      marginTop: '1rem',
      padding: '10px 20px',
      borderRadius: '30px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      border: 'none'
    }
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {localStorage.getItem('glamProfile') ? 'Create Your Look' : 'Create Your Look'}
      </h2>

      <div style={styles.section}>
        <label style={styles.label}>What occasion is your look for?</label>
        {occasionOptions.map(option => (
          <button
            type="button"
            key={option}
            style={{
              ...styles.button,
              ...(profile.occasions && profile.occasions.includes(option) ? styles.buttonActive : {})
            }}
            onClick={() => toggleOption('occasions', option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Location</label>
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter the location"
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Date</label>
        <input
          type="date"
          name="date"
          value={profile.date}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>What is your budget?</label>
        {budgetOptions.map(option => (
          <button
            type="button"
            key={option}
            style={{
              ...styles.button,
              ...(profile.budget && profile.budget.includes(option) ? styles.buttonActive : {})
            }}
            onClick={() => toggleOption('budget', option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button type="submit" style={styles.submit}>
        {localStorage.getItem('glamProfile') ? 'Generate Look' : 'Generate Look'}
      </button>

      {/* Additional Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate('/create')}
          style={{ ...styles.navButton, backgroundColor: '#dcdcdc', color: '#444' }}
        >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ ...styles.navButton, backgroundColor: '#f4f4f4', color: '#333' }}
        >
          Back to Looks
        </button>
      </div>
    </form>
  );
}

export default Look;
