require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();


app.use(express.json());                   
app.use(require('cors')());                

app.use('/api/links', require('./routes/link.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// THE REDIRECT ROUTE — must be last, catches everything else
app.get('/:slug', require('./controllers/link.controller').redirect);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));