import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';

const fileStore = new FileStore(session);
export const sessionStore = new fileStore();

export const sessionMiddleware = (configService: ConfigService) => {
  return session({
    name: 'express.sid',
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: Number(configService.get('SESSION_MAX_AGE')) },
    store: sessionStore,
  });
};
