import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collections = await config.client
        ?.db()
        .listCollections()
        .toArray();
      const collectionNames = collections?.map(
        (collection) => collection.name
      );
      res.json({ collectionNames });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:name', [
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.fields) return next();

    const { name } = req.params;

    try {
      // Assuming all data worth visualising has been set to required
      const documents = await config.client
        ?.db()
        .collection(name)
        .find({}, { projection: { _id: 0 } })
        .limit(5)
        .toArray();

      const fields = new Set();

      documents?.forEach((document) => {
        for (const key of Object.keys(document)) fields.add(key);
      });

      res.json({ fields: [...fields] });
    } catch (error) {
      next(error);
    }
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    const queryParams = Array.isArray(req.query.fields)
      ? Object.fromEntries(
          new Map(req.query.fields.map((field) => [field, 1]))
        )
      : { [req.query.fields as string]: 1 };

    try {
      const documents = await config.client
        ?.db()
        .collection(name)
        .find({}, { projection: { ...queryParams, _id: 0 } })
        .toArray();

      res.json({ documents });
    } catch (error) {
      next(error);
    }
  },
]);

export default router;
