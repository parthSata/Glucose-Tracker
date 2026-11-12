import jwt from 'jsonwebtoken'
import { env } from '../config/env'

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
