
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [savedLooks, setSavedLooks] = useState([]);

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-looks');
        const data = await response.json();
        setSavedLooks(data);
      } catch (err) {
        console.error('Failed to fetch saved looks:', err);
      }
    };

    fetchLooks();
  }, []);
  {savedLooks.map((look, idx) => (
    <div key={idx} style={styles.card}>
      <div>
        <strong>{look.title || `Look ${idx + 1}`}</strong>
        <p style={{ marginTop: '0.5rem' }}>{look.occasion}</p>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>
        {new Date(look.timestamp).toLocaleDateString()}
      </p>
      {/* Optional: show product names */}
      <ul style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem' }}>
        {look.products && look.products.map((prod, i) => (
          <li key={i}>{prod.name}</li>
        ))}
      </ul>
    </div>
  ))}
  
  const handleCreateLook = () => navigate('/look');
  const handleEditProfile = () => navigate('/create');

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: "'Segoe UI', sans-serif",
      background: '#fef6f9',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#d63384'
    },
    button: {
      padding: '10px 18px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: '#ff6fa3',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 4px 10px rgba(255, 105, 135, 0.3)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1.5rem',
      justifyItems: 'center'
    },
    card: {
      width: '150px',
      height: '220px',
      background: '#fff',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      textAlign: 'left',
      fontSize: '0.95rem',
      color: '#5a3e49',
      fontWeight: '500',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease',
    },
    plusCard: {
      width: '150px',
      height: '220px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '3rem',
      color: '#fff',
      backgroundColor: '#ff6fa3',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background 0.3s ease, transform 0.2s ease',
      boxShadow: '0 8px 16px rgba(255, 111, 163, 0.4)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Looks</h2>
        <button style={styles.button} onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>

      <div style={styles.grid}>
        {savedLooks.map((look, idx) => (
          <div key={idx} style={styles.card}>
            <div>
              <strong>{look.title || `Look ${idx + 1}`}</strong>
              <p style={{ marginTop: '0.5rem' }}>{look.occasion}</p>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              {new Date(look.timestamp).toLocaleDateString()}
            </p>
          </div>
        ))}


        {/* Always show this at the end */}
        <div
          style={styles.plusCard}
          onClick={handleCreateLook}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
