require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulated data store for storing short URLs
const shortUrls = {};

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Simulating short URL creation
  const shortUrl = 'https://short.url/' + Math.floor(Math.random() * 10000);

  // Store short URL in the data store
  shortUrls[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Redirect from short URL to original URL
app.get('/api/shorturl/:short', (req, res) => {
  const shortUrl = 'https://short.url/' + req.params.short;
  const originalUrl = shortUrls[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
