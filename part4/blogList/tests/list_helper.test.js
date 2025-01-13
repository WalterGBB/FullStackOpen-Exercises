const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: '1',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/1',
        likes: 7,
        __v: 0,
    },
    {
        _id: '2',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/2',
        likes: 3,
        __v: 0,
    },
    {
        _id: '3',
        title: 'Blog 3',
        author: 'Author 1',
        url: 'http://example.com/3',
        likes: 8,
        __v: 0,
    },
    {
        _id: '4',
        title: 'Blog 4',
        author: 'Author 2',
        url: 'http://example.com/4',
        likes: 6,
        __v: 0,
    },
    {
        _id: '5',
        title: 'Blog 5',
        author: 'Author 1',
        url: 'http://example.com/5',
        likes: 4,
        __v: 0,
    },
]

const listWithOneBlog = [
    {
        _id: '6',
        title: 'Single Blog',
        author: 'Single Author',
        url: 'http://example.com/6',
        likes: 5,
        __v: 0,
    },
]

describe('dummy', () => {
    test('dummy returns one', () => {
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has multiple blogs, returns the total likes', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 28)
    })

    test('when list is empty, returns zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })
})

describe('favorite blog', () => {
    test('returns the blog with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        const expected = {
            title: 'Blog 3',
            author: 'Author 1',
            likes: 8,
        }

        assert.deepStrictEqual(result, expected)
    })

    test('returns null when the list is empty', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
})

describe('most blogs', () => {
    test('returns the author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        const expected = {
            author: 'Author 1',
            blogs: 3,
        }

        assert.deepStrictEqual(result, expected)
    })

    test('returns null when the list is empty', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, null)
    })
})

describe('most likes', () => {
    test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs)
        const expected = {
            author: 'Author 1',
            likes: 19,
        }

        assert.deepStrictEqual(result, expected)
    })

    test('returns null when the list is empty', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that author with its likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        const expected = {
            author: 'Single Author',
            likes: 5,
        }

        assert.deepStrictEqual(result, expected)
    })
})
