const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let globalUser
let globalToken

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    for (let user of helper.initialUsers) {
        await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)
    }

    globalUser = helper.initialUsers.find(user => user.username === 'Ghost_Rider')

    const loginResponse = await api
        .post('/api/login')
        .send({ username: globalUser.username, password: globalUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    globalToken = loginResponse.body.token

    for (let blog of helper.initialBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${globalToken}`)
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    }
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('A new user can log in and create a blog successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const user = {
        username: "J_Oct",
        password: "SecurePass123!",
        name: "James Octavius"
    }

    await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const { username, password } = user
    const login = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const newBlog = {
        title: "PHP is an old language",
        author: "Carmen",
        url: "https:/www.php-old-language?.er",
        likes: 63
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1, 'Blog count did not increase')

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newBlog.title), 'New blog was not added to the database')
})

test('if no token is provided, it fails with status code 401 Unauthorized', async () => {
    const newBlog = {
        title: "I like to learn to program",
        author: "Frank",
        url: "https://learning-how-to-program.fs",
        likes: 7
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length, 'Blog count should not increase')
})

test('if likes property is missing, it defaults to zero', async () => {
    const newBlog = {
        title: "There is a great demand for programmers in 2025",
        author: "Black-Cat",
        url: "https://www.last-news-tech.pc",
    }

    const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${globalToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(savedBlog.body.likes, 0, 'Blog does not have 0 likes as default')
})

test('if the title or URL properties missing, the server response is 400 HTTP Status Code "Bad Request"', async () => {
    const newBlog = {
        author: 'F',
        likes: 78
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${globalToken}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.status, 400, 'The server does not respond with 400 HTTP Status Code when the title or URL properties are missing')
})

test('a blog can be deleted only by the user who created it', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const user = helper.initialUsers.find(user => user.username === 'Jane$')
    const { username, password } = user

    const login = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogToDelete = await Blog.findOne({ title: 'Is AI dangerous?' })

    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(403)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length, 'The server does not respond with 401 HTTP Status Code when a user tries to delete a blog that is not theirs')
})

test('a blog can be updated only by the user who created it', async () => {
    const newLikes = 100
    const user = helper.initialUsers.find(user => user.username === 'Jane$')
    const { username, password } = user

    const login = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogToUpdate = await Blog.findOne({ title: 'Is AI dangerous?' })
    const likesBeforeUpdate = blogToUpdate.likes

    await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ likes: newLikes })
        .expect(403)

    const blogAfterUpdate = await Blog.findById(blogToUpdate._id)
    const likesAfterUpdate = blogAfterUpdate.likes

    assert.strictEqual(likesBeforeUpdate, likesAfterUpdate, 'The likes of the blog changed even though the user was not authorized to update it')
})

after(async () => {
    await mongoose.connection.close()
})
