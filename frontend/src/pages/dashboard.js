
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();
  const [savedLooks, setSavedLooks] = useState([]);

  const productNameFromLine = (line) => {
    if (!line || !line.includes(':')) return '';
  
    const parts = line.split(':');
    if (parts.length < 2) return '';

    const afterColon = parts.slice(1).join(':').trim();
    const dashIndex = afterColon.indexOf(' - ');
    let productDescription = dashIndex !== -1 ? afterColon.slice(0, dashIndex).trim() : afterColon;

    productDescription = productDescription.replace(/^\*+/, '').trim();
  
    return productDescription || '';
  };
  
  
  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
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
      color: '#d63384',
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem',
      justifyItems: 'center'
    },
    card: {
      boxSizing: 'border-box',
      width: '220px',
      height: '300px',
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
      width: '220px',
      height: '300px',
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
  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const response = await fetch('http://localhost:5001/get-looks');
        const data = await response.json();
  
        const uniqueLooks = [];
        const seen = new Set();
  
        data.forEach(look => {
          // Ensure required fields exist
          if (!look.recommendation || !look.location || !Array.isArray(look.occasions) || look.occasions.length === 0) return;
        
          const normalizedRec = look.recommendation.replace(/\s+/g, ' ').trim().toLowerCase();
        
          if (!seen.has(normalizedRec)) {
            seen.add(normalizedRec);
            uniqueLooks.push(look);
          }
        });
  
        setSavedLooks(uniqueLooks);
      } catch (err) {
        console.error('Failed to fetch saved looks:', err);
      }
    };
  
    fetchLooks();
  }, []);
  
  
  
  const handleCreateLook = () => navigate('/look');
  const handleEditProfile = () => navigate('/create');
  
  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this look?')) return;
  
    try {
      const response = await fetch('http://localhost:5001/delete-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
  
      if (response.ok) {
        const updatedLooks = savedLooks.filter((_, i) => i !== index);
        setSavedLooks(updatedLooks);
      } else {
        alert('Failed to delete look.');
      }
    } catch (err) {
      console.error('Error deleting look:', err);
      alert('Error deleting look.');
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
      {savedLooks.map((look, index) => {
  const lines = look.recommendation
    ? look.recommendation.split('\n').filter(line => line.trim() !== '')
    : [];

  const productNames = [...new Set(lines.map(line => productNameFromLine(line)).filter(name => name.trim() !== ''))];

  const location = look.location?.trim() || '';
  const occasion = (look.occasions && look.occasions.length > 0 && look.occasions[0].trim()) || '';
  const parts = [];
  if (location) parts.push(capitalizeFirstLetter(location));
  if (occasion) parts.push(capitalizeFirstLetter(occasion));
  const title = parts.length > 0 ? parts.join(' ') : 'Unknown';

  return (
    <div key={index} style={{ ...styles.card }}>
      <div style={{
        textAlign: 'center',
        fontFamily: "'Roboto', sans-serif",
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
        {title}
      </div>

      <div style={{
        fontSize: '0.9rem',
        color: '#555',
        marginTop: '0.5rem',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        maxHeight: '180px',
        overflowY: 'auto',
      }}>
        {productNames.map((name, i) => (
          <div key={i} style={{ marginBottom: '6px' }}>
            • {name}
          </div>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(index);
        }}
        style={{
          marginTop: '10px',
          fontSize: '0.8rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: 'none',
          borderRadius: '6px',
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
})}


        {/* Add new look button */}
        <div
          style={styles.plusCard}
          onClick={handleCreateLook}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          +
        </div>
      </div>
    </div>
  );
  
}

export default Dashboard;
