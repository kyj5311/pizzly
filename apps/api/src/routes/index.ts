import { Router } from 'express'
import authRoutes from './auth.routes'
import growthRoutes from './growth.routes'
import homeRoutes from './home.routes'
import passRoutes from './pass.routes'
import questRoutes from './quest.routes'
import recordRoutes from './record.routes'
import shopRoutes from './shop.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/growth', growthRoutes)
router.use('/home', homeRoutes)
router.use('/pass', passRoutes)
router.use('/quests', questRoutes)
router.use('/records', recordRoutes)
router.use('/shop', shopRoutes)

export default router
