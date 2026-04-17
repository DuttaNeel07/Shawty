require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(express.json());
app.use(require('cors')({
  origin: corsOrigin === '*' ? true : corsOrigin.split(','),
  credentials: true,
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/links', require('./routes/link.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

app.get('/:slug', require('./controllers/link.controller').redirect);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));