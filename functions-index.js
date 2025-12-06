// functions/index.js — Example to deploy Express app as Firebase Function
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// You can import the existing express app code here or re-create routes.
// Example simple route:
app.get('/hello', (req, res) => res.send('Hello from Firebase Function!'));

// Export the express app as an HTTP function
exports.app = functions.https.onRequest(app);
