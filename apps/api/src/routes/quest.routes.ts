import { Router } from 'express'
import { complete, recommend } from '../controllers/quest.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.post('/recommend', requireAuth, recommend)
router.post('/complete', requireAuth, complete)

export default router
