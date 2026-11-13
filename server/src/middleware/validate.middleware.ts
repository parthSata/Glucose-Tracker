import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type RequestTarget = 'body' | 'query' | 'params'

/**
 * Zod-validate req.body / query / params, then replace that target with
 * the parsed value. Query (and sometimes params) are read-only getters in
 * Express, so we use defineProperty instead of direct assignment.
 */
export function validateRequest<T>(
  schema: ZodType<T>,
  target: RequestTarget = 'body',
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[target])

    Object.defineProperty(req, target, {
      value: parsed,
      writable: true,
      configurable: true,
      enumerable: true,
    })

    next()
  }
}
