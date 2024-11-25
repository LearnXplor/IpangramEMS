const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
connectDB();

// Import Routes
const userRoutes = require('./routes/user');
const departmentRoutes = require('./routes/department');
const queryRoutes = require('./routes/queryRoutes');

// Routes Middleware
app.use('/api/auth', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/queries', queryRoutes);

// Basic Route for Testing
app.get('/', (req, res) => {
   res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
   res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
   });
});

// Define the Port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
