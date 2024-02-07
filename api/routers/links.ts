import { Router } from 'express';
import ShortUrl from '../models/ShortUrl';
import { typeShortUrl, typeShortUrlWithoutId } from '../types';
import { randomUUID } from 'crypto';

const linksRouter = Router();

linksRouter.get('/', async (req, res, next) => {
  try {
    const results: typeShortUrl[] | null = await ShortUrl.find();

    res.send(results);
  } catch (e) {
    next(e);
  }
});

linksRouter.get('/:shortUrl', async (req, res, next) => {
  try {
    const shortUrl: string = req.params.shortUrl;
    const results: typeShortUrl | null = await ShortUrl.findOne({shortUrl});

    if (results) {
      res.status(301).redirect(results.originalUrl);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (e) {
    next(e);
  }
});

linksRouter.post('/', async (req, res, next) => {
  try {
    let shortUrl: string = '';
    let isUnique: boolean = false;

    while (!isUnique) {
      const url1 = randomUUID().replace(/[^a-zA-Z]/g, '').slice(-4);
      const url2 = req.body.originalUrl.replace(/[^a-zA-Z]/g, '').slice(-3).toUpperCase();
      shortUrl = url1 + url2;

      const existingUrl: typeShortUrl | null = await ShortUrl.findOne({shortUrl});
      if (!existingUrl) {
        isUnique = true;
      }
    }

    const shortUrlData: typeShortUrlWithoutId = {
      shortUrl: shortUrl,
      originalUrl: req.body.originalUrl
    };

    const userUrl = new ShortUrl(shortUrlData);
    await userUrl.save();

    res.send(userUrl);
  } catch (e) {
    next(e);
  }
});

export default linksRouter;