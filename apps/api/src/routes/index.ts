import { Router } from 'express'
import questRoutes from './quest.routes'
import recordRoutes from './record.routes'

const router = Router()

router.use('/quests', questRoutes)
router.use('/records', recordRoutes)

export default router
