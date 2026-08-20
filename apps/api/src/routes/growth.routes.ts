import { Router } from 'express'
import { devSetLevel, devSetToken, latest } from '../controllers/growth.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/latest', requireAuth, latest)
router.post('/dev-level', requireAuth, devSetLevel)
router.post('/dev-token', requireAuth, devSetToken)

export default router
