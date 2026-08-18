import { Router } from 'express'
import authRoutes from './auth.routes'
import questRoutes from './quest.routes'
import recordRoutes from './record.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/quests', questRoutes)
router.use('/records', recordRoutes)

export default router
