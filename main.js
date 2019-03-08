const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');

const app = express();

//read .env file
require('dotenv/config');

// setup mongoose connection
const urlDb = process.env.url;
mongoose.connect(urlDb, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/image',express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoutes);
app.use('/company', companyRoutes);

const port = process.env.port;
app.listen(port, () => {
  console.log(`Server is up and running on port number: ${port}`);
});