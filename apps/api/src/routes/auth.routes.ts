import { Router } from 'express'
import { login, saveOnboarding } from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.post('/login', login)
router.post('/onboarding', requireAuth, saveOnboarding)

export default router
