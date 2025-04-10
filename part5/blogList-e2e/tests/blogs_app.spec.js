const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showDetails, editBlog, deleteBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Johnny Blaze',
                username: 'Ghost_Rider',
                password: 'GhostAvenger7%'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await page.waitForResponse(response =>
            response.url().includes('/api/blogs') && response.status() === 200
        )
        await expect(page.locator('form')).toBeVisible()
        await expect(page.getByText('log in to application')).toBeVisible()
        await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
        await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Ghost_Rider', 'GhostAvenger7%')
            await expect(page.getByText('Johnny Blaze logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'invalidUser', '4578asda7/')
            await expect(page.getByText('Non-existent-User logged-in')).not.toBeVisible()
        })

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'Ghost_Rider', 'GhostAvenger7%')
            })

            test('a new blog can be created', async ({ page }) => {
                await createBlog(page, 'Top Developers 2025', 'NVIDIA', 'http://top-devs-2025-by-ibm.en')
                await expect(page.getByText('Top Developers 2025 by NVIDIA')).toBeVisible()
                await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
                await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
            })

            test('a blog can can be edited', async ({ page }) => {
                await createBlog(page, 'AI Trends', 'MIT', 'http://ml-mit.edu')
                await showDetails(page, 'AI Trends by MIT')
                await editBlog(page, 'AI Trends by MIT')
            })

            test('a blog can only be deleted by the user who created it.', async ({ page, request }) => {
                await createBlog(page, 'Data Science in 2025', 'IBM', 'http://data-science-2025.edu')
                await expect(page.getByText('Data Science in 2025 by IBM')).toBeVisible()
                await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
                await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
                await page.getByRole('button', { name: 'logout' }).click()
                await expect(page.getByText('successful logout')).toBeVisible()
                await request.post('/api/users', {
                    data: {
                        name: 'Jack Sparrow',
                        username: 'Captain_Jack',
                        password: 'JackSparrow9$'
                    }
                })
                await loginWith(page, 'Captain_Jack', 'JackSparrow9$')
                await expect(page.getByText('Jack Sparrow logged-in')).toBeVisible()
                await expect(page.getByText('Data Science in 2025 by IBM')).toBeVisible()
                await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
                await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
                await createBlog(page, 'High-Tech Rockets', 'SpaceX', 'http://high-tech-rockets.sx')
                await expect(page.getByText('High-Tech Rockets by SpaceX')).toBeVisible()
                await deleteBlog(page, 'High-Tech Rockets by SpaceX')
                await expect(page.getByText('High-Tech Rockets by SpaceX')).not.toBeVisible()
            })

            test('Blogs are sorted by number of likes in descending order.', async ({ page }) => {
                await createBlog(page, 'First Blog', 'AAA', 'http://AAA.edu')
                await createBlog(page, 'Second Blog', 'EEE', 'http://EEE.edu')
                await createBlog(page, 'Third Blog', 'III', 'http://III.edu')

                await showDetails(page, 'First Blog by AAA')
                await editBlog(page, 'First Blog by AAA')

                await showDetails(page, 'Second Blog by EEE')
                await editBlog(page, 'Second Blog by EEE')
                await editBlog(page, 'Second Blog by EEE')

                await showDetails(page, 'Third Blog by III')
                await editBlog(page, 'Third Blog by III')
                await editBlog(page, 'Third Blog by III')
                await editBlog(page, 'Third Blog by III')
                await page.waitForTimeout(500)

                const blogElements = await page.locator('.blog').all()

                const blogTexts = await Promise.all(blogElements.map(async blog => {
                    return await blog.textContent()
                }))

                expect(blogTexts[0]).toContain('Third Blog by III')
                expect(blogTexts[1]).toContain('Second Blog by EEE')
                expect(blogTexts[2]).toContain('First Blog by AAA')
            })
        })
    })
})