import { Router } from 'express'
import { healthRoutes } from './health.routes'

const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)

export { apiRoutes }
