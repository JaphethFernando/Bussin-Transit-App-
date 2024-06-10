//index.js
const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

//Route
const servicesRoute = require('./routes/services')
app.use(cors());
app.use(express.json());

app.use('/', servicesRoute);

app.listen(port, () => {
    console.log(`Running on port : ${port}`);
})