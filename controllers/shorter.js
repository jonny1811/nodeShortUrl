'user strict';
const express = require('express');
const dns = require('dns');
const nanoid = require('nanoid');
const Urls = require('../models/urls');

const app = express();
// Url que se encarga de redirigir desde la shortUrl a la direccion original
app.get('/shorturl/:short_url', (req, res) => {
    const {short_url} = req.params;
    
    Urls.find({short_url: short_url})
        .exec((err, urlDB) => {
            if(err) {
                res.status(500).json({err});
            }

            if(!urlDB) {
                res.status(500).json({
                    err: {
                        message: 'Url no existe'
                    }
                });
            }

            res.redirect(`${urlDB[0]['original_url']}`);
        })
})

// Url que se encarga de crear un shortUrl...
app.post('/shorturl/new', (req, res) => {
    let originalUrl;
    let body = req.body;
	try {
        originalUrl = new URL(req.body.url);
	} catch (err) {
		return res.status(400).send({ error: 'invalid URL' });
	}

	dns.lookup(originalUrl.hostname, (err) => {
		if (err) {
			return res.status(400).send({ error: 'Address not found' });
		}
    });

    const url = new Urls({
        original_url: originalUrl.href,
        short_url: nanoid(7)
    });

    url.save((err, urlDB) => {
        if(err) {
            return res.status(400).json(err);
        }

        res.status(200).json({
            original_url: urlDB.original_url,
            short_url: urlDB.short_url
        });
    });
});

module.exports = app;
