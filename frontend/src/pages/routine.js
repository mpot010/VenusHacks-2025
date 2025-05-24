import React, { useState } from 'react';

function Routine() {
  const makeupProducts = [
    { name: 'Concealer', description: 'Helps cover blemishes and dark circles.', imgSrc: '/images/concealer.png' },
    { name: 'Foundation', description: 'Provides an even base for makeup.', imgSrc: '/images/foundation.png' },
    { name: 'Blush', description: 'Adds a flush of color to your cheeks.', imgSrc: '/images/blush.png' },
    { name: 'Highlighter', description: 'Gives your skin a glowing finish.', imgSrc: '/images/highlighter.png' },
    { name: 'Contour', description: 'Shapes and defines your facial features.', imgSrc: '/images/contour.png' },
    { name: 'Eyeshadow', description: 'Adds color and depth to your eyelids.', imgSrc: '/images/eyeshadow.png' },
    { name: 'Mascara', description: 'Enhances the volume and length of your eyelashes.', imgSrc: '/images/mascara.png' },
    { name: 'Lipstick', description: 'Adds color to your lips.', imgSrc: '/images/lipstick.png' },
    { name: 'Setting Spray', description: 'Helps to lock in your makeup all day.', imgSrc: '/images/setting-spray.png' },
    { name: 'Primer', description: 'Preps your skin for smooth makeup application.', imgSrc: '/images/primer.png' }
  ];

  const [selectedProducts, setSelectedProducts] = useState([]);

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
  };

  const handleLikeThisLook = () => {
    localStorage.setItem('selectedLook', JSON.stringify(selectedProducts));
    alert('You liked this look!');
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
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Your Makeup Routine</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {makeupProducts.map((product) => (
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

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          style={{ ...styles.button, ...styles.submit }}
          onClick={handleLikeThisLook}
        >
          I Like This Look
        </button>

        <button
          type="button"
          style={{ ...styles.button, ...styles.submit, marginLeft: '10px' }}
          onClick={handleRegenerate}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}

export default Routine;
