// backend.js (CommonJS)
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Autoriser Angular à appeler ton backend
app.use(express.json());

const CLIENT_ID = 'BVPAYdIRj8ADlISKxW1JfpunVjfBVSM8';
const CLIENT_SECRET = 'T5Nyck1rApa9FnTU9WVmsdnYyOz7CGzfHa1y5hJ4ovr9';

/**
 * Endpoint pour obtenir un access token Orange Money
 */
app.post('/api/orange-token', async (req, res) => {
  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération du token :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * Endpoint pour créer une transaction Orange Money
 */
app.post('/api/orange-transaction', async (req, res) => {
  try {
    const { token, transactionData } = req.body;
    const response = await fetch(
      'https://api.orange.com/orange-money-webpay/ml/v1/webpayment',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la transaction :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log('✅ Backend démarré sur http://localhost:3000'));
