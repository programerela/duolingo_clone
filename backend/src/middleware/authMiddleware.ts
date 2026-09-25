import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

interface AccessTokenPayload {
  sub: string;
  type: 'access';
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing access token');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

    if (payload.type !== 'access' || !payload.sub) {
      throw new Error('Invalid token');
    }

    req.user = { id: payload.sub };
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired access token');
  }
}
