import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Routine() {
    const [routineSteps, setRoutineSteps] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hasLikedLook, setHasLikedLook] = useState(false);
  const navigate = useNavigate(); 
  useEffect(() => {
    const saved = localStorage.getItem('recommendation');
    if (saved) {
      const lines = saved.split('\n').filter(Boolean);
      const parsed = lines.map((line) => {
        const clean = str => str.replace(/^\*+|\*+$/g, '').trim();
        const fullMatch = line.match(/^\s*\d+\.\s*\*?(.+?)\*?\s*:\s*(.+)/);
        if (fullMatch) {
          return {
            name: clean(fullMatch[1]),
            description: fullMatch[2].trim()
          };
        }
        return null;
      }).filter(Boolean); 
      
      
      setRoutineSteps(parsed);
    }
  }, []);
  

  const handleToggle = (product) => {
    setSelectedProducts(prevState => {
      if (prevState.includes(product)) {
        return prevState.filter(item => item !== product);
      } else {
        return [...prevState, product];
      }
    });
  };

  const handleRegenerate = () => {
    setSelectedProducts([]);
    setHasLikedLook(false);
  };

  const handleSaveLook = () => {
    const likedProducts = routineSteps.filter(product => !selectedProducts.includes(product.name));
  
    const lookData = {
      title: "My Saved Look",
      occasion: "Custom",
      timestamp: new Date().toISOString(),
      products: likedProducts
    };
  
    fetch('http://localhost:5000/save-look', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lookData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save look.');
        alert('Your look has been saved!');
        navigate('/dashboard');
      })
      .catch(error => {
        alert('Error saving look: ' + error.message);
      });
  };

  const handleLikeThisLook = () => {
    setHasLikedLook(true);
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #fff0f6, #ffe6f0)',
      boxShadow: '0 8px 20px rgba(255, 182, 193, 0.25)',
      fontFamily: "'Segoe UI', sans-serif",
      color: '#5a3e49'
    },
    section: {
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
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
    productBox: {
      textAlign: 'center',
      border: '1px solid #ffb6c1',
      borderRadius: '10px',
      padding: '15px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: '0.3s'
    },
    productBoxActive: {
      borderColor: '#ff6fa3',
      backgroundColor: '#ffe6f0'
    },
    productImage: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      marginBottom: '10px'
    },
    instructions: {
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '20px',
      fontWeight: '500',
      color: '#5a3e49'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Your Makeup Routine</h2>

      {/* Instructions before liking the look */}
      {!hasLikedLook && (
        <div style={styles.instructions}>
          <p>Select the products you like by checking the boxes. Once you're done, click "I Like This Look" to save your choices!</p>
        </div>
      )}

      {/* Displaying all products before the user likes the look */}
      {!hasLikedLook ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {routineSteps.map((product) => (
            <div
              key={product.name}
              style={{
                ...styles.productBox,
                ...(selectedProducts.includes(product.name) ? styles.productBoxActive : {})
              }}
              onClick={() => handleToggle(product.name)}
            >
              <img
                src={product.imgSrc}
                alt={product.name}
                style={styles.productImage}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.name)}
                onChange={() => handleToggle(product.name)}
                style={{ marginTop: '10px' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {routineSteps
            .filter(product => !selectedProducts.includes(product.name)) 
            .map((product) => (
              <div key={product.name} style={styles.productBox}>
                <img
                  src={product.imgSrc}
                  alt={product.name}
                  style={styles.productImage}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {/* Show "Save Look" and "Regenerate" buttons only after liking the look */}
        {hasLikedLook && (
          <>
            <button
              type="button"
              style={{ ...styles.button, ...styles.submit }}
              onClick={handleSaveLook}
            >
              Save Look
            </button>
          </>
        )}

        {/* Regenerate button always visible */}
        <button
          type="button"
          style={{ ...styles.button, ...styles.submit, marginLeft: '10px' }}
          onClick={handleRegenerate}
        >
          Regenerate
        </button>

        {!hasLikedLook && (
          <button
            type="button"
            style={{ ...styles.button, ...styles.submit, marginLeft: '10px' }}
            onClick={handleLikeThisLook}
          >
            I Like This Look
          </button>
        )}
      </div>
    </div>
  );
}

export default Routine;


