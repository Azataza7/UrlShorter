export interface typeShortUrl {
  _id: string;
  shortUrl: string;
  originalUrl: string;
}

export type typeShortUrlWithoutId = Omit<typeShortUrl, '_id'>