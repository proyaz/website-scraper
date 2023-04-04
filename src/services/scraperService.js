const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const cheerio = require('cheerio');
const Page = require('../models/pageModel');
const Document = require('../models/documentModel');
const Website = require('../models/websiteModel');
const documentService = require('./documentService');

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';

async function getPageContent(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.setExtraHTTPHeaders({ 'Referer': 'https://www.facebook.com/' });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content;
}

function extractTitle(html) {
  const $ = cheerio.load(html);
  const title = $('title').text();
  return title;
}

async function createWebsite(websiteName) {
  const newWebsite = new Website({ websiteName });
  await newWebsite.save();
  return newWebsite;
}

async function scrapePage(url, website) {
  const content = await getPageContent(url);
  const pageTitle = extractTitle(content);

  const page = new Page({
    website: website._id,
    pageUrl: url,
    pageTitle,
    pageContents: content,
  });

  await page.save();
  website.pages.push(page);
  await website.save();

  const $ = cheerio.load(content);
  const links = $('a');
  const internalLinks = [];

  links.each((i, link) => {
    const href = $(link).attr('href');
    if (href && href.startsWith(url) && !href.endsWith('.pdf') && !href.endsWith('.docx') && !href.endsWith('.ppt')) {
      internalLinks.push(href);
    } else if (href && (href.endsWith('.pdf') || href.endsWith('.docx') || href.endsWith('.ppt'))) {
      scrapeDocument(href, website);
    }
  });

  for (const link of internalLinks) {
    await scrapePage(link, website);
  }
}

async function scrapeDocument(url, website) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  const fileName = uuidv4();
  const fileType = url.split('.').pop();

  let content;
  if (fileType === 'pdf') {
    content = await documentService.readPDF(buffer);
  } else if (fileType === 'docx') {
    content = await documentService.readDOCX(buffer);
  } else if (fileType === 'ppt') {
    content = await documentService.readPPT(buffer);
  }

  const document = new Document({
    website: website._id,
    documentName: fileName,
    documentUrl: url,
    documentContent: content,
  });

  await document.save();
  website.documents.push(document);
  await website.save();
}

async function scrapeWebsite(url) {
  const websiteName = new URL(url).hostname;
  const website = await createWebsite(websiteName);
  await scrapePage(url, website);
}

exports.scrapeWebsite = scrapeWebsite;

