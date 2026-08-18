import { Router } from 'express'
import { latest } from '../controllers/growth.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/latest', requireAuth, latest)

export default router
