import React, { useState } from 'react';

function App() {
  const [lastPrices, setLastPrices] = useState(['', '', '']);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (idx, value) => {
    const arr = [...lastPrices];
    arr[idx] = value;
    setLastPrices(arr);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        last_prices: lastPrices.map(Number)
      };
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setPrediction('Error predicting stock price');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Stock Price Predictor</h2>
      <form onSubmit={handlePredict}>
        <label>
          Enter last 3 closing prices:
          {lastPrices.map((value, idx) => (
            <input
              key={idx}
              type="number"
              value={value}
              required
              step="any"
              onChange={e => handleChange(idx, e.target.value)}
              style={{ display: 'block', margin: '8px 0', width: '100%' }}
              placeholder={`Day ${idx + 1}`}
            />
          ))}
        </label>
        <button type="submit" disabled={loading || lastPrices.some(v => v === '')}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>
      {prediction !== null && (
        <div style={{ marginTop: 20 }}>
          <strong>Predicted Next Price:</strong> {prediction}
        </div>
      )}
    </div>
  );
}

export default App;