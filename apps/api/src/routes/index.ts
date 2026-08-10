import { Router } from 'express'
import questRoutes from './quest.routes'

const router = Router()

router.use('/quests', questRoutes)

export default router
