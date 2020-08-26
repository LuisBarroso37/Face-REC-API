const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middleware/authorization');

// Set up database
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

// Instantiate express
const app = express();

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => res.json('It is working!'));
app.post('/signin', (req, res) => signin.signInAuthentication(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileGet(req, res, db));
app.post('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileUpdate(req, res, db));
app.put('/image', auth.requireAuth, (req, res) => image.handleImage(req, res, db));
app.post('/imageUrl', auth.requireAuth, (req, res) => image.handleApiCall(req, res));

app.listen(3000, () => {
    console.log('App is running on port 3000');
});