const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  website: { type: Schema.Types.ObjectId, ref: 'Website' },
  pageUrl: String,
  pageTitle: String,
  pageContents: String,
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
