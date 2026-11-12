import { Router } from 'express'
import { authRoutes } from './auth.routes'
import { healthRoutes } from './health.routes'

const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)
apiRoutes.use('/auth', authRoutes)

export { apiRoutes }
