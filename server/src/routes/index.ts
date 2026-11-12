import { Router } from 'express'
import { authRoutes } from '@/routes/auth.routes'
import { healthRoutes } from '@/routes/health.routes'

const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)
apiRoutes.use('/auth', authRoutes)

export { apiRoutes }
