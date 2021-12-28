import { MongoClient } from 'mongodb';

type Config = {
  uri: string;
  client: MongoClient | null;
};

export const config: Config = {
  uri: '',
  client: null,
};
