import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Create() {
  const navigate = useNavigate();

  const skinOptions = ['rosacea', 'acne', 'eczema', 'dry skin', 'other', 'none'];
  const allergyOptions = ['parabens', 'synthetic dyes', 'tea tree', 'metals', 'other', 'none'];

  const [profile, setProfile] = useState({
    skinConditions: [],
    allergies: [],
    ownedProducts: '',
    preferredBrands: '',
    otherSkinCondition: '',
    otherAllergy: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('glamProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const toggleOption = (category, value) => {
    setProfile(prev => {
      const selected = new Set(prev[category]);
      selected.has(value) ? selected.delete(value) : selected.add(value);

      const updated = { ...prev, [category]: [...selected] };

      if (value === 'other' && !selected.has('other')) {
        if (category === 'skinConditions') updated.otherSkinCondition = '';
        if (category === 'allergies') updated.otherAllergy = '';
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
    try {
      const response = await axios.post('http://localhost:5001/save-profile', profile);
      if (response.status === 200) {
        localStorage.setItem('glamProfile', JSON.stringify(profile));
        navigate('/dashboard');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
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
      margin: '4px',
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
      width: '150px',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      marginTop: '0.25rem',
      fontSize: '0.9rem'
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
    <form style={styles.container} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {localStorage.getItem('glamProfile') ? 'Edit Your Profile' : 'Create Your Profile'}
      </h2>

      <div style={styles.section}>
        <label style={styles.label}>What best describes your skin?</label>
        <div style={styles.optionsRow}>
          {skinOptions.map(option => (
            <div key={option} style={styles.optionItem}>
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...(profile.skinConditions.includes(option) ? styles.buttonActive : {})
                }}
                onClick={() => toggleOption('skinConditions', option)}
              >
                {option}
              </button>
              {option === 'other' && profile.skinConditions.includes('other') && (
                <textarea
                  name="otherSkinCondition"
                  value={profile.otherSkinCondition}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Other skin condition"
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Do you have any known allergies?</label>
        <div style={styles.optionsRow}>
          {allergyOptions.map(option => (
            <div key={option} style={styles.optionItem}>
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...(profile.allergies.includes(option) ? styles.buttonActive : {})
                }}
                onClick={() => toggleOption('allergies', option)}
              >
                {option}
              </button>
              {option === 'other' && profile.allergies.includes('other') && (
                <textarea
                  name="otherAllergy"
                  value={profile.otherAllergy}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Other allergy"
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Products you already own</label>
        <textarea
          name="ownedProducts"
          value={profile.ownedProducts}
          onChange={handleChange}
          style={{ ...styles.input, width: '100%' }}
          placeholder="List your products, separated by commas"
          rows={3}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Preferred brands</label>
        <textarea
          name="preferredBrands"
          value={profile.preferredBrands}
          onChange={handleChange}
          style={{ ...styles.input, width: '100%' }}
          placeholder="List brands you like (e.g. e.l.f., Fenty, etc.)"
          rows={2}
        />
      </div>

      <button type="submit" style={styles.submit}>
        {localStorage.getItem('glamProfile') ? 'Save Changes' : 'Save & Continue'}
      </button>
    </form>
  );
}

export default Create;
