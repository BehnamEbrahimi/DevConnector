const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const error = require('./middleware/error');
const path = require('path');

const app = express();

process.on('uncaughtException', ex => {
  console.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', ex => {
  console.error(ex.message, ex);
  process.exit(1);
});

// Connect DB
connectDB();

// Init Middlewares
app.use(cors());
app.use(express.json()); // Access req.body

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use(error);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server strated on port ${PORT}`));
