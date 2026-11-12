import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

export type JwtPayload = {
  sub: string
  email: string
  name: string
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)

  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    throw new Error('Invalid token payload')
  }

  return {
    sub: decoded.sub,
    email: typeof decoded.email === 'string' ? decoded.email : '',
    name: typeof decoded.name === 'string' ? decoded.name : '',
  }
}
