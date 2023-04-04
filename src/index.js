const express = require('express');
const connectToDB = require('./utils/dbHelper');
const scraperController = require('./controllers/scraperController').scrapeWebsite;
const path = require('path');

connectToDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/scrape', scraperController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
