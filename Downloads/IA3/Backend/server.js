  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const path = require('path');

  // Routes
  const adminRoutes = require('./routes/adminRoutes');
  const authRoutes = require('./routes/auth');
  const placementRoutes = require("./routes/placementRoutes"); 

  dotenv.config();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use("/api/placements", placementRoutes); 


  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
