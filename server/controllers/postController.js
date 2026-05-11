import Post from '../models/Post.js'

function parsePage(value) {
  const page = parseInt(value, 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

function parseLimit(value) {
  const limit = parseInt(value, 10)
  return Number.isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 50)
}

export async function createPost(req, res) {
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' })
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    author: req.user._id,
  })

  return res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post,
  })
}

export async function getPosts(req, res) {
  const page = parsePage(req.query.page)
  const limit = parseLimit(req.query.limit)
  const skip = (page - 1) * limit

  const filter = { author: req.user._id }
  const total = await Post.countDocuments(filter)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return res.json({
    success: true,
    data: posts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  })
}
