import express from 'express'
import { createPost, getPosts } from '../controllers/postController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.post('/', createPost)
router.get('/', getPosts)

export default router
