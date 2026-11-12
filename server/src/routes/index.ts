import { Router } from 'express'
import { authRoutes } from '@/routes/auth.routes'
import { healthRoutes } from '@/routes/health.routes'
import { readingsRoutes } from '@/routes/readings.routes'

const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)
apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/readings', readingsRoutes)

export { apiRoutes }
