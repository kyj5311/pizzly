import { Router } from 'express'
import { status } from '../controllers/home.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/status', requireAuth, status)

export default router
