import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';
import { config } from '../config';

const router = express.Router();

router.post(
  '/open',
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const client = new MongoClient(body.uri);
    config.client = client;
    config.uri = body.uri;
    try {
      await new Promise((r) => setTimeout(r, 4000));
      await client.connect();
      res.status(200);
      res.json({
        message: 'Connection Successiful',
      });
    } catch (error) {
      next(error);
      await client.close();
      process.exit(1);
    }
  }
);

router.get(
  '/close',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await config.client?.close();
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
