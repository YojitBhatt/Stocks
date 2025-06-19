const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Proxy prediction requests to Python service
app.post('/api/predict', async (req, res) => {
  try {
    const { day } = req.body;
    const resp = await axios.post('http://localhost:5000/predict', { day });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: 'Prediction service failed' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});