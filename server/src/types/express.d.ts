export type AuthUserContext = {
  id: string
  email: string
  name: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserContext
    }
  }
}

export {}
