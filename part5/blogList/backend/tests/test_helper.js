const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'My top five programming languages',
        author: 'Michael Burges',
        url: 'https://my-5-top.com',
        likes: 37
    },
    {
        title: 'Is AI dangerous?',
        author: 'Fred Elbow',
        url: 'https://dangers-of-ai.com',
        likes: 29
    },
    {
        title: 'The future of programming',
        author: 'Tod Aikon',
        url: 'https://programming-news.ef',
        likes: 48
    }
]

const initialUsers = [
    {
        username: "Ghost_Rider",
        password: "SecurePass123!",
        name: "Johnny Blaze"
    },
    {
        username: "Jane$",
        password: "MyPassword!",
        name: "Jane Smith"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, initialUsers, usersInDb
}