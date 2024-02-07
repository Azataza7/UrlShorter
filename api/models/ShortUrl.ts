import mongoose, { Schema } from 'mongoose';

const UserLinkSchema = new Schema({
  shortUrl: String,
  originalUrl: {
    type: String,
    required: true
  },
});

const ShortUrl = mongoose.model('shortUrl', UserLinkSchema);

export default ShortUrl;