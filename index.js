require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validUrl = require('valid-url'); // External library to validate URLs

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const shortUrls = {};
let shortUrlCounter = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL
  if (!validUrl.isWebUri(originalUrl)) {
    console.error(`Invalid URL: ${originalUrl}`);
    return res.status(400).json({ error: 'invalid url' });
  }

  const shortUrl = shortUrlCounter++;
  shortUrls[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});


app.get('/api/shorturl/:short', (req, res) => {
  const shortUrl = parseInt(req.params.short);
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
