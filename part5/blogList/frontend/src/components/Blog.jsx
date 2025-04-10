import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog, deleteBlog, updatedBlog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const viewDetails = () => {
    setShowDetails(!showDetails)
  }

  const giveLike = async (event) => {
    event.preventDefault()
    try {
      await updatedBlog(blog.id)
    } catch (error) {
      console.error("Error when liking the blog:", error)
    }
  }

  return (
    <div className="blog">
      <p>
        {blog.title} by <b>{blog.author}</b>
        <button onClick={viewDetails}>{showDetails ? "hide" : "view"}</button>
        {currentUser && blog.user.username === currentUser.username && (
          <button onClick={() => deleteBlog(blog.id)}>delete</button>
        )}
      </p>
      {showDetails ? (
        <>
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes} <button onClick={giveLike}>like</button>
          </p>
          <p>
            <b>{blog.user.name}</b>
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  updatedBlog: PropTypes.func.isRequired,
}

export default Blog
