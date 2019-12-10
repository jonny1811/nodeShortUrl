require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URL;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/routes'));

app.get('/', (req, res) => {
	const htmlPath = path.join(__dirname, 'views', 'index.html');
	res.sendFile(htmlPath);
});


mongoose.connect(dbUrl, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Conectado a la DB correctamente');
})
.catch(err => console.log(err));

app.listen(port, function() {
	console.log('Node.js listening ...', port);
});
