require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const supabase = require('./config/supabase');

const app = express();

// Test Supabase connection
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error && error.code !== 'PGRST116') console.log('⚠️  Supabase connection issue:', error.message);
    else console.log('✅ Supabase Connected');
  } catch (err) {
    console.log('⚠️  Supabase connection error:', err.message);
  }
})();

// Middleware
app.use(helmet());


const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ''), // without trailing slash
  process.env.CLIENT_URL + '/', // with trailing slash
  'http://localhost:3000',
  'https://discover-dhaka.vercel.app',
  'https://discover-dhaka.vercel.app/'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for now to debug
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(compression());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/places', require('./routes/places'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/events', require('./routes/events'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
