// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== TEST ROUTE (Fix for "Cannot GET /api/test") =====
app.get("/api/test", (req, res) => {
    res.json({ success: true, message: "API is working correctly!" });
});

// ===== ADMIN LOGIN =====
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";  // change later or move to .env

app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({
            success: true,
            message: "Login successful",
            token: "admin-token-123"
        });
    }

    res.json({ success: false, message: "Invalid login details" });
});

// ===== BUY AIRTIME =====
app.post("/api/buy-airtime", (req, res) => {
    const { network, phone, amount } = req.body;

    if (!network || !phone || !amount) {
        return res.json({ success: false, message: "All fields required" });
    }

    return res.json({
        success: true,
        message: "Airtime purchase successful",
        details: { network, phone, amount }
    });
});

// ===== BUY DATA =====
app.post("/api/buy-data", (req, res) => {
    const { network, phone, plan } = req.body;

    if (!network || !phone || !plan) {
        return res.json({ success: false, message: "All fields required" });
    }

    return res.json({
        success: true,
        message: "Data purchase successful",
        details: { network, phone, plan }
    });
});

// ===== CHECK SERVER STATUS =====
app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

// ===== START SERVER =====
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server live on port ${port}`);
});
