import { Router } from 'express'
import { authRoutes } from '@/routes/auth.routes'
import { healthRoutes } from '@/routes/health.routes'
import { readingsRoutes } from '@/routes/readings.routes'
import { reportsRoutes } from '@/routes/reports.routes'

const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)
apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/readings', readingsRoutes)
apiRoutes.use('/reports', reportsRoutes)

export { apiRoutes }
