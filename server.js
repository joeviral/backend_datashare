// server.js — Express backend with simple admin auth and Africa's Talking airtime integration
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Simple session-based auth for admin
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set secure:true when using HTTPS
}));

// Read/write helpers
function readData(){
  try{
    if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    const txt = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  }catch(e){
    return [];
  }
}
function writeData(arr){
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// Basic auth endpoints
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if(username === ADMIN_USER && password === ADMIN_PASS){
    req.session.authenticated = true;
    res.json({ ok:true });
  } else {
    res.status(401).json({ error: 'invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok:true }));
});

app.get('/api/check-session', (req, res) => {
  if(req.session && req.session.authenticated) return res.json({ ok:true });
  res.status(401).json({ error: 'not authenticated' });
});

// Airtime integration (Africa's Talking) — optional, runs only if env vars are set
let airtimeClient = null;
if(process.env.AT_USERNAME && process.env.AT_KEY){
  try{
    const Africastalking = require('africastalking');
    const AT = Africastalking({ username: process.env.AT_USERNAME, apiKey: process.env.AT_KEY });
    airtimeClient = AT.AIRTIME;
    console.log('Africa\'s Talking airtime client initialized.');
  }catch(e){
    console.warn('Africa\'s Talking SDK not installed or failed to init. To enable, run: npm install africastalking');
  }
}

// POST create entry (and optionally send airtime)
app.post('/api/gift', async (req, res) => {
  const { phone, network, amount, message } = req.body || {};
  if(!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });
  const entries = readData();
  const id = Date.now().toString(36);
  const finalMessage = (message && message.trim().length>0 ? message.trim() : 'You have successfully gifted data to the number') + ' ' + phone;
  const entry = { id, phone, network, amount, message, text: finalMessage, createdAt: new Date().toISOString() };
  entries.unshift(entry);
  writeData(entries);

  // If airtimeClient available, attempt to send airtime
  if(airtimeClient){
    try{
      // Africa's Talking expects recipients as array of objects or strings depending on SDK version
      const recipients = [{ phoneNumber: phone, currencyCode: 'NGN', amount: amount }];
      const response = await airtimeClient.send({ recipients });
      // attach response to returned object
      entry.airtimeResponse = response;
      writeData(entries);
      return res.json({ ok:true, id, text: finalMessage, airtime: response });
    }catch(err){
      console.error('Airtime send error', err);
      return res.status(500).json({ ok:false, error: 'Airtime send failed', details: err.message || err });
    }
  }

  res.json({ ok:true, id, text: finalMessage, note: 'Airtime not sent (no airtime client configured).' });
});

// GET entries
app.get('/api/entries', (req, res) => {
  if(!req.session || !req.session.authenticated) return res.status(401).json({ error: 'not authenticated' });
  const entries = readData();
  res.json(entries);
});

// PUT edit entry
app.put('/api/entries/:id', (req, res) => {
  if(!req.session || !req.session.authenticated) return res.status(401).json({ error: 'not authenticated' });
  const id = req.params.id;
  const { phone, network, amount, message } = req.body || {};
  const entries = readData();
  const idx = entries.findIndex(e => e.id === id);
  if(idx === -1) return res.status(404).json({ error:'not found' });
  entries[idx] = { ...entries[idx], phone, network, amount, message, text: (message||entries[idx].message) + ' ' + (phone||entries[idx].phone) };
  writeData(entries);
  res.json({ ok:true, entry: entries[idx] });
});

// DELETE
app.delete('/api/entries/:id', (req, res) => {
  if(!req.session || !req.session.authenticated) return res.status(401).json({ error: 'not authenticated' });
  const id = req.params.id;
  let entries = readData();
  const before = entries.length;
  entries = entries.filter(e => e.id !== id);
  writeData(entries);
  res.json({ ok:true, deleted: before - entries.length });
});

app.listen(PORT, () => {
  console.log(`Joetech Data Share running on http://localhost:${PORT}`);
});
