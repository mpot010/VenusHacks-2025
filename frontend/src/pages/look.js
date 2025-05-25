import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Look() {
  const navigate = useNavigate();

  const occasionOptions = ['wedding', 'beach', 'hangout', 'meeting', 'other', 'none'];
  const budgetOptions = ['under $50', '$50 to $75', '$75 to $100', '$100 to $150', 'more than $150'];
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    occasions: [],
    budget: [],
    location: '',
    date: '',
    otherOccasion: ''
  });

  useEffect(() => {
    setProfile({
      occasions: [],
      budget: [],
      location: '',
      date: '',
      otherOccasion: ''
    });
  }, []);

  const toggleOption = (category, value) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        [category]: [value], // Only keep the clicked value
      };
  
      // Clear otherOccasion if it's not selected
      if (category === 'occasions' && value !== 'other') {
        updated.otherOccasion = '';
      }
  
      return updated;
    });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const saved = JSON.parse(localStorage.getItem('glamProfile')) || {};
    let combinedProfile = { ...saved, ...profile };
  
    if (profile.occasions.includes('other') && profile.otherOccasion.trim()) {
      combinedProfile.occasions = [
        ...profile.occasions.filter(o => o !== 'other'),
        profile.otherOccasion.trim()
      ];
    }
  
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
          const lookToSave = {
            date: profile.date,
            location: profile.location,
            occasions: profile.occasions.includes('other') && profile.otherOccasion
              ? [...profile.occasions.filter(o => o !== 'other'), profile.otherOccasion.trim()]
              : profile.occasions,
            recommendation: result.recommendation,
          };
        
          await fetch('http://localhost:5001/save-look', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(lookToSave),
          });
        
          localStorage.setItem('recommendation', result.recommendation);
          navigate('/routine');
        
        
      } else {
        alert('Failed to generate look: ' + (result.message || 'unknown error'));
      }
    } catch (err) {
      console.error("Error calling backend:", err);
      alert('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  const styles = {
    spinner: {
      width: '16px',
      height: '16px',
      border: '3px solid #fff',
      borderTop: '3px solid #ff6fa3',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginLeft: '10px',
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    
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
    },
    optionsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      alignItems: 'flex-start',
      marginTop: '0.5rem'
    },
    optionItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <form style={styles.container} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {localStorage.getItem('glamProfile') ? 'Create Your Look' : 'Create Your Look'}
        </h2>

        <div style={styles.section}>
          <label style={styles.label}>What occasion is your look for?</label>
          <div style={styles.optionsRow}>
            {occasionOptions.map(option => (
              <div key={option} style={styles.optionItem}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    ...(profile.occasions.includes(option) ? styles.buttonActive : {})
                  }}
                  onClick={() => toggleOption('occasions', option)}
                >
                  {option}
                </button>
                {option === 'other' && profile.occasions.includes('other') && (
                  <textarea
                    name="otherOccasion"
                    value={profile.otherOccasion}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Please describe the occasion"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>
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
                ...(profile.budget.includes(option) ? styles.buttonActive : {})
              }}
              onClick={() => toggleOption('budget', option)}
            >
              {option}
            </button>
          ))}
        </div>

        <button type="submit" style={styles.submit} disabled={loading}>
          Generate Look
          {loading && <span style={styles.spinner}></span>}
        </button>


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
    </>
  );
}

export default Look;
