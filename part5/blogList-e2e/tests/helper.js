import { expect } from "@playwright/test"

const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'save' }).click()
    await page.getByText(title).waitFor()
}

const showDetails = async (page, blogTitleAndAuthor) => {
    const blog = page.locator('.blog', { hasText: blogTitleAndAuthor })
    const viewButton = blog.getByRole('button', { name: /view|hide/i })

    const buttonText = await viewButton.textContent()
    if (buttonText.toLowerCase() === 'view') {
        await viewButton.click()
    }
}

const editBlog = async (page, blogTitleAndAuthor) => {
    const blog = page.locator('.blog', { hasText: blogTitleAndAuthor })

    const likesLocator = blog.getByText(/^likes: \d+/)
    const likesText = await likesLocator.textContent()
    const likesBefore = parseInt(likesText.match(/\d+/)[0])

    await blog.getByRole('button', { name: 'like' }).click()
    await expect(blog.getByText(`likes: ${likesBefore + 1}`)).toBeVisible()
}

const deleteBlog = async (page, blogTitleAndAuthor) => {
    const blog = page.locator('.blog', { hasText: blogTitleAndAuthor })

    const handleDialog = async (dialog) => {
        expect(dialog.message()).toBe('Do you really want to delete this blog?')
        await dialog.accept()
        page.off('dialog', handleDialog)
    }

    page.on('dialog', handleDialog)

    await blog.getByRole('button', { name: 'delete' }).click()
}

export { loginWith, createBlog, showDetails, editBlog, deleteBlog }