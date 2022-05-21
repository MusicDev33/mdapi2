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

import { API_BASE } from '@config/constants';
import * as RoutesLib from '@config/route-defs';

const PORT = process.env.PORT;
const db = `mongodb://localhost:27017/${process.env.DB_NAME}`;

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  console.log(`Database Connected: ${db}`);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database Error: ' + err);
});

// CORS
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Routes
app.use(API_BASE + 'books', RoutesLib.BooksRoutes);
app.use(API_BASE + 'reads', RoutesLib.ReadsRoutes);
app.use(API_BASE + 'synopses', RoutesLib.SynopsisRoutes);
app.use(API_BASE + 'auth', RoutesLib.AuthRoutes);

app.get(API_BASE, (req: Request, res: Response) => {
  res.status(404).send('<h1 style="color: blue; text-align: center;">404 Error</h1>');
});

// Server
app.listen(PORT, () => {
  console.log('\nServer started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + PORT);
  console.log(`Reachable at ${API_BASE}`);
});
