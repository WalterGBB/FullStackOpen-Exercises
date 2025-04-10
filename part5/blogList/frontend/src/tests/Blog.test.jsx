import { render, screen, fireEvent } from '@testing-library/react'
import Blog from '../components/Blog'
import { expect, test, vi } from 'vitest'

const blog = {
    title: "Top Models USA",
    author: "Snarf",
    likes: 7658,
    url: "https://Top-models.usa",
    user: {
        id: "54554s4dad5a4da",
        name: "Javier"
    }
}

let mockUpdateBlog, mockDeleteBlog

beforeEach(() => {
    mockUpdateBlog = vi.fn()
    mockDeleteBlog = vi.fn()
})

test("The rendered blog shows the author and title, but not the number of likes or the URL.", () => {
    render(<Blog blog={blog} updatedBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />)

    expect(screen.getByText((content) => content.includes(blog.title))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes(blog.author))).toBeInTheDocument()

    expect(screen.queryByText(blog.likes.toString())).not.toBeInTheDocument()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
})

test("The blog's URL and number of likes are displayed when you click the View button.", () => {
    render(<Blog blog={blog} updatedBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />)

    fireEvent.click(screen.getByText("view"))

    expect(screen.getByText((content) => content.includes(blog.url))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes(blog.likes))).toBeInTheDocument()
})

test("If the like button is clicked twice, the event handler that the component received as props is called twice.", () => {
    render(<Blog blog={blog} updatedBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />)

    fireEvent.click(screen.getByText("view"))
    const likeButton = screen.getByText("like")

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
})
