const axios = require('axios');
const pdfParse = require('pdf-parse');
const { Document } = require('docx');
const PPTX = require('pptxgenjs');

const readPDF = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = await pdfParse(response.data);
    return data.text;
  } catch (err) {
    console.error('Error reading PDF:', err.message);
    return null;
  }
};

const readDocx = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const doc = new Document(buffer);
    const content = doc.body.getText();
    return content;
  } catch (err) {
    console.error('Error reading DOCX:', err.message);
    return null;
  }
};

const readPPT = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const ppt = new PPTX();
    await ppt.load(buffer);

    let content = '';
    ppt.slides.forEach((slide) => {
      slide.content.forEach((item) => {
        if (item.text) content += item.text + ' ';
      });
    });

    return content;
  } catch (err) {
    console.error('Error reading PPT:', err.message);
    return null;
  }
};

const readDocument = async (url) => {
  const extension = url.split('.').pop().toLowerCase();

  let contents;
  let name = url.split('/').pop();

  switch (extension) {
    case 'pdf':
      contents = await readPDF(url);
      break;
    case 'docx':
      contents = await readDocx(url);
      break;
    case 'ppt':
      contents = await readPPT(url);
      break;
    default:
      console.error('Unsupported document type:', extension);
      return null;
  }

  return {
    name,
    contents,
  };
};

async function processDocument(documentUrl, documentName) {
    const extension = path.extname(documentName);
    let documentContent = '';
  
    switch (extension) {
      case '.pdf':
        documentContent = await readPDF(documentUrl);
        break;
      case '.docx':
        documentContent = await readDocx(documentUrl);
        break;
      case '.pptx':
        documentContent = await readPPTX(documentUrl);
        break;
      default:
        throw new Error('Unsupported document format');
    }
  
    return documentContent;
  }
  
  module.exports = {
    processDocument,
  };