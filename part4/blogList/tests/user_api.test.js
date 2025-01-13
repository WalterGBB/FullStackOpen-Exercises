const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initialUsers) {
        let userObject = new User(user)
        await userObject.save()
    }
})

const invalidUser = {
    username: 'AE',
    password: '482',
    name: 'Armstrong'
}

describe('POST /api/users', () => {
    test('Cannot create an invalid user.', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('An invalid user creation returns an appropriate status code and error message.', async () => {
        const result = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        assert.strictEqual(result.body.error, 'User validation failed: username: AE is too short. Please enter a username of at least 3 letters')
    })
})

after(async () => {
    await mongoose.connection.close()
})