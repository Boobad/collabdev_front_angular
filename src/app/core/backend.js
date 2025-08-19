const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================== CONFIG DB ==================
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ton mot de passe MySQL
  database: 'Collabdev'
});

// Vérifie si colonne notif_token existe, sinon la crée
db.query(`SHOW COLUMNS FROM transactions LIKE 'notif_token'`, (err, results) => {
  if (err) {
    console.log('Erreur vérification colonne notif_token:', err.message);
  } else if (results.length === 0) {
    db.query(`ALTER TABLE transactions ADD COLUMN notif_token VARCHAR(255) NULL`, (err) => {
      if (err) console.log('Erreur ajout colonne notif_token:', err.message);
      else console.log('Colonne notif_token ajoutée avec succès');
    });
  } else {
    console.log('Colonne notif_token déjà existante');
  }
});

// ================== ORANGE MONEY ==================
const CLIENT_ID = 'BVPAYdIRj8ADlISKxW1JfpunVjfBVSM8';
const CLIENT_SECRET = 'T5Nyck1rApa9FnTU9WVmsdnYyOz7CGzfHa1y5hJ4ovr9';

async function getOrangeAccessToken() {
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
    return data.access_token;
  } catch (err) {
    console.error('Erreur token Orange Money :', err);
    return null;
  }
}

// ================== ROUTE TOKEN ==================
app.post('/api/orange-token', async (req, res) => {
  const token = await getOrangeAccessToken();
  if (!token) return res.status(500).json({ error: 'Impossible de récupérer token' });
  res.json({ access_token: token });
});

// ================== CREATE TRANSACTION ==================
app.post('/api/transactions', (req, res) => {
  const { user_id, provider, phone_number, coins, amount, order_id } = req.body;
  if (!user_id || !provider || !phone_number || !coins || !amount || !order_id) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  const sql = `
    INSERT INTO transactions (user_id, provider, phone_number, coins, amount, order_id, status)
    VALUES (?, ?, ?, ?, ?, ?, 'en attente')
  `;
  db.query(sql, [user_id, provider, phone_number, coins, amount, order_id], (err, result) => {
    if (err) {
      console.error('Erreur création transaction:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json({ success: true, transactionId: result.insertId });
  });
});

// ================== GET TRANSACTIONS ==================
app.get('/api/transactions/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ message: 'UserId invalide' });

  const sql = `
    SELECT id, provider, phone_number, coins, amount, order_id, status, pay_token, notif_token, created_at
    FROM transactions
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erreur récupération transactions:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// ================== ORANGE MONEY WEBPAY ==================
app.post('/api/orange-transaction', async (req, res) => {
  const { transactionData } = req.body;
  const token = await getOrangeAccessToken();
  if (!token) return res.status(500).json({ error: 'Impossible de récupérer token' });

  try {
    const response = await fetch('https://api.orange.com/orange-money-webpay/ml/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });
    const data = await response.json();

    // Stocker pay_token et notif_token dans DB
    if (data.pay_token) {
      const sql = `UPDATE transactions SET pay_token = ?, notif_token = ? WHERE order_id = ?`;
      db.query(sql, [data.pay_token, data.notif_token || '', transactionData.order_id], (err) => {
        if (err) console.error('Erreur update pay_token / notif_token:', err);
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erreur création transaction Orange Money:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ================== ORANGE NOTIFICATION ==================
app.post('/api/orange-notification', (req, res) => {
  const { order_id, status, notif_token } = req.body;

  console.log('Notification reçue:', req.body);

  let newStatus = 'en attente';
  if (status === 'SUCCESS') newStatus = 'complété';
  else if (status === 'FAILED') newStatus = 'échoué';
  else if (status === 'EXPIRED') newStatus = 'expiré';

  let sql, params;

  if (order_id) {
    sql = 'UPDATE transactions SET status = ? WHERE order_id = ?';
    params = [newStatus, order_id];
  } else if (notif_token) {
    sql = 'UPDATE transactions SET status = ? WHERE notif_token = ?';
    params = [newStatus, notif_token];
  } else {
    console.log('Notification sans order_id ni notif_token, impossible de trouver la transaction');
    return res.status(400).json({ success: false, message: 'order_id et notif_token manquants' });
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Erreur mise à jour transaction:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (result.affectedRows === 0) {
      console.log('Aucune transaction trouvée pour cette notification');
    } else {
      console.log(`Transaction mise à jour: ${newStatus}`);
    }
    res.json({ success: true });
  });
});

// ================== CHECK TRANSACTION STATUS ==================
app.post('/api/check-status', async (req, res) => {
  const { order_id, amount, pay_token } = req.body;
  const token = await getOrangeAccessToken();
  if (!token) return res.status(500).json({ error: 'Impossible de récupérer token' });

  try {
    const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/transactionstatus', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_id, amount, pay_token })
    });
    const data = await response.json();

    let newStatus = 'en attente';
    if (data.status === 'SUCCESS') newStatus = 'complété';
    else if (data.status === 'FAILED') newStatus = 'échoué';
    else if (data.status === 'EXPIRED') newStatus = 'expiré';

    const sql = `UPDATE transactions SET status = ? WHERE order_id = ?`;
    db.query(sql, [newStatus, order_id], (err) => {
      if (err) console.error('Erreur mise à jour status:', err);
    });

    res.json({ success: true, status: newStatus, data });
  } catch (err) {
    console.error('Erreur check status:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ================== START SERVER ==================
app.listen(3000, () => console.log('✅ Backend démarré sur http://localhost:3000'));
