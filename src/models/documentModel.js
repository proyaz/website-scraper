const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  website: { type: Schema.Types.ObjectId, ref: 'Website' },
  documentName: String,
  documentUrl: String,
  documentContent: String,
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
