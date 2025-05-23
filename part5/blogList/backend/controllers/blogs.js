const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const blog = await Blog.findById(id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body

        const user = request.user

        if (!title) {
            return response.status(400).json({
                error: 'title missing'
            })
        }

        if (!url) {
            return response.status(400).json({
                error: 'url missing'
            })
        }

        const blog = new Blog({
            title,
            author,
            url,
            likes: likes,
            user: user.id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        const returnedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

        response.status(201).json(returnedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const blogToDelete = await Blog.findById(id)
        const user = request.user

        if (!blogToDelete) {
            return response.status(404).json({ error: 'Blog not found' })
        }

        if (blogToDelete.user.toString() !== user.id) {
            return response.status(403).json({ error: 'UNAUTHORIZED OPERATION: `A blog can be deleted only by the user who created it`' })
        }

        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const blogToUpdate = await Blog.findById(id)
        const user = await User.findById(blogToUpdate.user)

        if (!blogToUpdate) {
            return response.status(404).json({ error: 'Blog not found' })
        }

        blogToUpdate.likes += 1
        await Blog.findByIdAndUpdate(id, blogToUpdate, { new: true, runValidators: true, context: 'query' })

        const updatedBlog = await blogToUpdate.populate('user', { username: 1, name: 1 })
        response.status(200).json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter