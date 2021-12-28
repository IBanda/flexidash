import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import connectionRouter from './routes/connection';
import introspectionRouter from './routes/introspect';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/connection', connectionRouter);
app.use('/introspect', introspectionRouter);

app.listen(PORT);
