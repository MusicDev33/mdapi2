// tslint:disable-next-line
require('tsconfig-paths/register');
import dotenv from 'dotenv';

import mongoose from 'mongoose';

import { Request, Response } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
require('dotenv-defaults/config');

import { API_BASE, WHITELIST_CORS } from '@config/constants';
import * as RoutesLib from '@config/route-defs';
import * as limits from '@config/rate-limit';
import { generalAuth } from '@middleware/auth';

const PORT = process.env.PORT;
const db = `mongodb://localhost:27017/${process.env.DB_NAME}`;

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  console.log(`Database Connected: ${db}`);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database Error: ' + err);
});

const app = express();

// CORS
const corsDelegate = (req: any, cb: any) => {
  console.log(req.header('Origin'));

  let corsOptions;

  corsOptions = { origin: true };

  cb(null, corsOptions);
}

app.use(cors(corsDelegate));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Loaded here so helmet's security policy doesn't block the image.
app.get(API_BASE, (_: Request, res: Response) => {
  const imgUrl = 'https://www.pngfind.com/pngs/m/569-5691407_can-of-beans-monday-bushs-baked-beans-hd.png';
  res.status(404).send(`<img src="${imgUrl}" />`);
});

app.use(helmet());

// Routes
app.use(API_BASE + 'books', [generalAuth], RoutesLib.BooksRoutes);
app.use(API_BASE + 'reads', [generalAuth], RoutesLib.ReadsRoutes);
app.use(API_BASE + 'synopses', [generalAuth], RoutesLib.SynopsisRoutes);
app.use(API_BASE + 'auth', RoutesLib.AuthRoutes, limits.authLimit);

// Server
app.listen(PORT, () => {
  console.log('\nServer started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + PORT);
  console.log(`Reachable at ${API_BASE}`);
});
