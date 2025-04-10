import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from '../components/BlogForm'
import { expect, test, vi } from 'vitest'

test("The form calls the event handler it received as props with the correct details when a new blog is created.", () => {
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)
    const submitButton = screen.getByText("save")

    fireEvent.change(titleInput, { target: { value: "Top Models USA" } })
    fireEvent.change(authorInput, { target: { value: "Snarf" } })
    fireEvent.change(urlInput, { target: { value: "https://Top-models.usa" } })

    fireEvent.submit(submitButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
        title: "Top Models USA",
        author: "Snarf",
        url: "https://Top-models.usa"
    })
})
