// tslint:disable-next-line
require('tsconfig-paths/register');
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
require('dotenv-defaults/config');

// import { userPassportAuth } from '@config/passport';
import { API_BASE, ALLOWED_ORIGINS } from '@config/constants';
// import * as RoutesLib from '@config/route-defs';

// import WebSocket from 'ws';

if (process.env.AUTH_TOKEN === 'lmao') {
  console.log('Change auth token.');
  process.exit(1);
}

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
const accessControl = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  console.log(origin);
  
  if (origin && typeof origin === 'string' && ALLOWED_ORIGINS.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  // res.header('Access-Control-Allow-Origin', 'http://bioinfo.usu.edu');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, KBL-User-Agent');
  res.header('Access-Control-Allow-Credentials', 'true');
  return next();
}


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(accessControl);

// Passport
// userPassportAuth(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
// app.use(API_BASE + 'persons', RoutesLib.PersonRoutes);

app.get(API_BASE, (req: Request, res: Response) => {
  res.status(404).send('<h1 style="color: blue; text-align: center;">404 Error</h1>');
});

// Server
app.listen(PORT, () => {
  console.log('\nKBL started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + PORT);
  console.log(`Reachable at ${API_BASE}`);

  console.log(ALLOWED_ORIGINS);
});

// Web Socket server
/*
const ws = new WebSocket.WebSocketServer({port: 7071}, () => {
  console.log('WebSocket online.')
});

let numListeners = 0;

ws.on('connection', (socket, req) => {
  console.log(`Connection opened from ${req.socket.remoteAddress}`);

  socket.on('message', (message) => {
    console.log(message.toString());
  });
});
*/