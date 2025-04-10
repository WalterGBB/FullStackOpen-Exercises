import { useState } from "react"
import PropTypes from "prop-types"

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        try {
            await createBlog({
                title: title,
                author: author,
                url: url
            })
            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (error) {
            console.error('Error adding blog:', error)
        }
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={addBlog}>
                <div>
                    <label htmlFor="title">title: </label>
                    <input
                        id="title"
                        value={title}
                        data-testid='title'
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="author">author: </label>
                    <input
                        id="author"
                        value={author}
                        data-testid='author'
                        onChange={event => setAuthor(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="url">url: </label>
                    <input
                        id="url"
                        value={url}
                        data-testid='url'
                        onChange={event => setUrl(event.target.value)}
                    />
                </div>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm
