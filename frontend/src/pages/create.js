import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
  const navigate = useNavigate();

  const skinOptions = ['rosacea', 'acne', 'eczema', 'dry skin', 'other', 'none'];
  const allergyOptions = ['parabens', 'synthetic dyes', 'tea tree', 'metals', 'other', 'none'];

  // ✅ Load saved profile if available
  const [profile, setProfile] = useState({
    skinConditions: [],
    allergies: [],
    ownedProducts: '',
    preferredBrands: ''
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
      return { ...prev, [category]: [...selected] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('glamProfile', JSON.stringify(profile));
    navigate('/dashboard');
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
    }
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {localStorage.getItem('glamProfile') ? 'Edit Your Glam Profile' : 'Create Your Glam Profile'}
      </h2>

      <div style={styles.section}>
        <label style={styles.label}>What best describes your skin?</label>
        {skinOptions.map(option => (
          <button
            type="button"
            key={option}
            style={{
              ...styles.button,
              ...(profile.skinConditions.includes(option) ? styles.buttonActive : {})
            }}
            onClick={() => toggleOption('skinConditions', option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Do you have any known allergies?</label>
        {allergyOptions.map(option => (
          <button
            type="button"
            key={option}
            style={{
              ...styles.button,
              ...(profile.allergies.includes(option) ? styles.buttonActive : {})
            }}
            onClick={() => toggleOption('allergies', option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Products you already own</label>
        <textarea
          name="ownedProducts"
          value={profile.ownedProducts}
          onChange={handleChange}
          style={styles.input}
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
          style={styles.input}
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
