import { Router } from 'express'
import { recommend } from '../controllers/quest.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.post('/recommend', requireAuth, recommend)

export default router
