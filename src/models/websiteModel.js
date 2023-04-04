const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  websiteName: String,
  pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
