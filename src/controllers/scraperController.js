const scraperService = require('../services/scraperService');

exports.scrapeWebsite = async (req, res) => {
    try {
      const { url } = req.body;
      const scrapedData = await scraperService.scrapeWebsite(url);
      res.status(200).json({ data: scrapedData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
