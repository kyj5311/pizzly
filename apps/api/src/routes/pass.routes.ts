import { Router } from 'express'
import { purchase, status } from '../controllers/pass.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/status', requireAuth, status)
router.post('/purchase', requireAuth, purchase)

export default router
