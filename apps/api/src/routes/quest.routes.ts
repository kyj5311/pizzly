import { Router } from 'express'
import { complete, detail, list, recommend } from '../controllers/quest.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.post('/recommend', requireAuth, recommend)
router.get('/list', requireAuth, list)
router.get('/:id', requireAuth, detail)
router.post('/complete', requireAuth, complete)

export default router
