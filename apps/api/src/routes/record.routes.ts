import { Router } from 'express'
import { boxes, summary, today, tokens } from '../controllers/record.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/today', requireAuth, today)
router.get('/summary', requireAuth, summary)
router.get('/rewards/boxes', requireAuth, boxes)
router.get('/rewards/tokens', requireAuth, tokens)

export default router
