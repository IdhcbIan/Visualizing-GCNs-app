import React, { useState, useEffect } from 'react';
import KNNGraphVisualizer from './KNNGraphVisualizer';

const Renderer = () => {
  const [knnData, setKnnData] = useState([]);
  const [k, setK] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxK, setMaxK] = useState(10); // Default max value
  
  useEffect(() => {
    // Load data from rks.txt
    fetch('/resnet152_output.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load data file');
        }
        return response.json();
      })
      .then(data => {
        setKnnData(data);
        
        // Set the maximum K value based on the number of elements
        // Subtract 1 because we don't count the node itself
        if (data.length > 0) {
          setMaxK(Math.max(10, data.length - 1));
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleKChange = (e) => {
    // Allow empty input temporarily
    if (e.target.value === '') {
      setK('');
      return;
    }
    
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      // Enforce min/max constraints
      if (newValue < 1) {
        setK(1);
      } else if (newValue > maxK) {
        setK(maxK);
      } else {
        setK(newValue);
      }
    }
  };

  // When input loses focus, ensure we have a valid number
  const handleKBlur = () => {
    if (k === '' || isNaN(k)) {
      setK(1); // Default to 1 if invalid
    } else {
      // Ensure it's a number (in case it was temporarily a string)
      setK(parseInt(k, 10));
    }
  };

  const incrementK = () => {
    // Convert to number if it's a string
    const currentK = typeof k === 'string' ? parseInt(k, 10) || 0 : k;
    if (currentK < maxK) {
      setK(currentK + 1);
    }
  };

  const decrementK = () => {
    // Convert to number if it's a string
    const currentK = typeof k === 'string' ? parseInt(k, 10) || 2 : k;
    if (currentK > 1) {
      setK(currentK - 1);
    }
  };

  return (
    <div className="renderer-container">
      <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
        <label htmlFor="k-value">K value: </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={decrementK} 
            disabled={k <= 1}
            style={{ 
              padding: '5px 10px', 
              cursor: k <= 1 ? 'not-allowed' : 'pointer',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px 0 0 4px'
            }}
          >
            -
          </button>
          <input 
            type="text" 
            id="k-value" 
            value={k} 
            onChange={handleKChange}
            onBlur={handleKBlur}
            style={{
              width: '60px',
              padding: '5px',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderLeft: 'none',
              borderRight: 'none'
            }}
          />
          <button 
            onClick={incrementK} 
            disabled={k >= maxK}
            style={{ 
              padding: '5px 10px', 
              cursor: k >= maxK ? 'not-allowed' : 'pointer',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '0 4px 4px 0'
            }}
          >
            +
          </button>
        </div>
        <span style={{ marginLeft: '5px' }}>
          (Max: {maxK})
        </span>
      </div>
      
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : knnData.length > 0 ? (
        <KNNGraphVisualizer data={knnData} k={k} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Renderer;