import cors from 'cors'
import express from 'express'
import { env } from '@/config/env'
import { errorMiddleware } from '@/middleware/error.middleware'
import { apiRoutes } from '@/routes'
import { ApiError } from '@/utils/api-error'

const app = express()

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', apiRoutes)

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Route not found'))
})

app.use(errorMiddleware)

export { app }
