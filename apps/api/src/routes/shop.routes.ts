import { Router } from 'express'
import { items, purchase } from '../controllers/shop.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.get('/items', requireAuth, items)
router.post('/items/:itemId/purchase', requireAuth, purchase)

export default router
