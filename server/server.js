const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// === API Routes ===
app.get('/api', (req, res) => {
  res.send('✅ API is running ...And DB connected');
});

// === Serve React Frontend ===
const buildPath = path.resolve(__dirname, '../client/build');
const indexPath = path.resolve(buildPath, 'index.html');

app.use(express.static(buildPath));

// Log every request
app.use((req, res, next) => {
  console.log(`📥 Requested: ${req.method} ${req.path}`);
  next();
});

// Wildcard: Send React app for all other routes
app.get('/*', (req, res) => {
  res.sendFile(indexPath, err => {
    if (err) {
      console.error("❌ Error serving React:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
