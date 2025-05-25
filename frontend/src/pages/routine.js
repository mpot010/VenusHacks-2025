import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';

function Routine() {
  const [routineSteps, setRoutineSteps] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hasLikedLook, setHasLikedLook] = useState(false);
  const locationState = useLocation();
  const [loading, setLoading] = useState(false);
  const keywordImages = {
    lip: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.08.44%20PM.png?updatedAt=1748125013304',
    eyelin: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.21.14%20PM.png?updatedAt=1748125280909',
    serum: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.14.22%20PM.png?updatedAt=1748125048225',
    foundation: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.18.27%20PM.png?updatedAt=1748125112139',
    mascara: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.22.41%20PM.png?updatedAt=1748125368167',
    concealer: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.18.51%20PM.png?updatedAt=1748125138640',
    blush: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.19.42%20PM.png?updatedAt=1748125189916',
    contour: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.20.33%20PM.png?updatedAt=1748125238098',
    bronzer: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.20.33%20PM.png?updatedAt=1748125238098',
    brow: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.22.01%20PM.png?updatedAt=1748125327535',
    shadow: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.23.41%20PM.png?updatedAt=1748125426584',
    moisturizer: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.24.02%20PM.png?updatedAt=1748125612583',
    cream: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%204.09.46%20PM.png?updatedAt=1748128191990',
    cleans:'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%204.23.09%20PM.png?updatedAt=1748128994672',
    spray:'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.14.22%20PM.png?updatedAt=1748125048225',
    mask:'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%205.04.08%20PM.png?updatedAt=1748131457009',
    exfoliat:'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%205.04.08%20PM.png?updatedAt=1748131457009',
    foundation: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.18.27%20PM.png?updatedAt=1748125112139',
    treatment:'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%204.23.09%20PM.png?updatedAt=1748128994672',
    sun: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.24.16%20PM.png?updatedAt=1748125612857',
    spf: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.24.16%20PM.png?updatedAt=1748125612857',
    prime: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.27.41%20PM.png?updatedAt=1748125667887',
    powder: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%203.28.55%20PM.png?updatedAt=1748125741219',
    toner: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%204.50.55%20PM.png?updatedAt=1748130665365',
    highlight: 'https://ik.imagekit.io/rbfrqccr5/Screen%20Shot%202025-05-24%20at%204.04.48%20PM.png?updatedAt=1748127894642'
  };
  const getKeywordImage = (productName) => {
    const entry = Object.entries(keywordImages).find(([keyword]) =>
      productName.toLowerCase().includes(keyword)
    );
    return entry ? entry[1] : null;
  };
  const navigate = useNavigate(); 
  useEffect(() => {
    const state = locationState.state;
    if (state?.recommendation) {
      localStorage.setItem('recommendation', state.recommendation);
    }
    const saved = localStorage.getItem('recommendation');
    if (saved) {
      const lines = saved.split('\n').filter(Boolean);
      const parsed = lines.map((line) => {
        const clean = str => str.replace(/^\*+|\*+$/g, '').trim();
        const fullMatch = line.match(/^\s*\d+\.\s*\*?(.+?)\*?\s*:\s*(.+)/);
        if (fullMatch) {
          const name = clean(fullMatch[1]);
          return {
            name,
            description: fullMatch[2].trim(),
            imgSrc: getKeywordImage(name) 
          };
        }
        return null;
      }).filter(Boolean);
  
      setRoutineSteps(parsed);
    }
  }, []);
  useEffect(() => {
    const location = localStorage.getItem('location');
    const rawDate = localStorage.getItem('date');
  
    if (location && rawDate) {
      // Convert date to ISO format 'YYYY-MM-DD'
      const isoDate = new Date(rawDate).toISOString().slice(0, 10);
      console.log('Sending date to backend:', isoDate); // Debug log
  
      fetch('http://localhost:5001/get-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, date: isoDate })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Weather Error:', data.error);
          } else {
            console.log('Weather data:', data);
          }
        })
        .catch(err => {
          console.error('Fetch error:', err);
        });
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

  const handleRegenerate = async () => {
    setLoading(true);
    const disliked = [...selectedProducts];
    if (disliked.length === 0) return;
  
    try {
      const response = await fetch('http://localhost:5001/regenerate-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dislikedProducts: disliked })
      });
  
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        const newSteps = [...routineSteps];
  
        result.alternatives.forEach((alt, i) => {
          const fullMatch = alt.match(/^\s*\[*([^\]]+)\]*\s*:\s*(.+?)\s*-\s*(.+)/);
          if (fullMatch) {
            const [_, brandAndProduct, stepName, instructions] = fullMatch;
            const category = disliked[i];
            const description = `${brandAndProduct.trim()} - ${instructions.trim()}`;
            const indexToReplace = newSteps.findIndex(p => p.name === category);
            if (indexToReplace !== -1) {
              newSteps[indexToReplace] = {
                name: category,
                description: description,
                imgSrc: getKeywordImage(category)
              };
            }
          }
        });
  
        setRoutineSteps(newSteps);
        setSelectedProducts([]);
      } else {
        alert('Failed to regenerate: ' + result.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleSaveLook = () => {
    const likedProducts = routineSteps
      .filter(product => !selectedProducts.includes(product.name))
      .map(product => ({
        name: product.name,
        description: product.description,
        imgSrc: getKeywordImage(product.name)
      }));
  
      const lookData = {
        title: "Look for " + (localStorage.getItem('date') || 'Unknown'),
        occasion: JSON.parse(localStorage.getItem('occasions') || '["Unknown"]'),
        location: localStorage.getItem('location') || 'Unknown',
        budget: JSON.parse(localStorage.getItem('budget') || '["Unknown"]'),
        timestamp: new Date().toISOString(),
        products: likedProducts,
        recommendation: localStorage.getItem('recommendation') || ''
      };
  
    fetch('http://localhost:5001/save-look', {
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
  <>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Your Makeup Routine</h2>

      {/* Instructions before liking the look */}
      {!hasLikedLook && (
        <div style={styles.instructions}>
          <p>Select the products you don't like by checking the boxes. Once you're done, click "I Like This Look" to save your choices or "Regenerate" to replace the options you don't like!</p>
        </div>
      )}

      {/* Displaying all products before the user likes the look */}
      {!hasLikedLook ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {routineSteps.map((product) => {

  return (
    <div
      key={product.name}
      style={{
        ...styles.productBox,
        ...(selectedProducts.includes(product.name) ? styles.productBoxActive : {})
      }}
      onClick={() => handleToggle(product.name)}
    >
      {/* Only show image if it matches the keyword */}
      { product.imgSrc && (
      <img
        src={product.imgSrc}
        alt={product.name}
        style={styles.productImage}
      />
)}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <input
        type="checkbox"
        checked={selectedProducts.includes(product.name)}
        onChange={() => handleToggle(product.name)}
        style={{ marginTop: '10px' }}
      />
    </div>
  
  );
})}

        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {routineSteps
            .filter(product => !selectedProducts.includes(product.name)) 
            .map((product) => (
              <div key={product.name} style={styles.productBox}>
                {getKeywordImage(product.name) && (
                <img
                src={getKeywordImage(product.name)}
                alt={product.name}
                style={styles.productImage}
            />
            )}
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

        {!hasLikedLook &&(
        <button
          type="button"
          style={{ ...styles.button, ...styles.submit, marginLeft: '10px' }}
          onClick={handleRegenerate}
        >
          Regenerate
          {loading && <span style={styles.spinner}></span>}
        </button>
        )}

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
  </>  
  );
}

export default Routine;