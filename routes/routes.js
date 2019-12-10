'use strict'

const express = require('express');

const app = express.Router();

app.use(require('../controllers/shorter.js'));

module.exports = app;