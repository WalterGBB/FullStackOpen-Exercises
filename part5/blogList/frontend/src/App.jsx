import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import blogService from "./services/blog"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"

function App() {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [messageClass, setmessageClass] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll()
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      } catch (error) {
        console.error("Error fetching notes:", error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setmessageClass('successful')
      setErrorMessage('successful login')
      setTimeout(() => setErrorMessage(""), 5000)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error("Error during login:", error)
      setmessageClass('error')
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(""), 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedNoteappUser')
      blogService.setToken(null)
      setmessageClass('successful')
      setErrorMessage('successful logout')
      setTimeout(() => setErrorMessage(""), 5000)
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error("Error during logout:", error)
      setmessageClass('error')
      setErrorMessage('Failed to logout')
      setTimeout(() => setErrorMessage(""), 5000)
    }
  }

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setmessageClass('successful')
      setErrorMessage('blog added successfully')
      setTimeout(() => setErrorMessage(""), 5000)
    } catch (error) {
      console.error("Error adding blog:", error)
      setmessageClass('error')
      setErrorMessage("Failed to add blog")
      setTimeout(() => setErrorMessage(""), 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      if (window.confirm('Do you really want to delete this blog?')) {
        const status = await blogService.deleteBlog(id)
        if (status === 204) {
          setBlogs(blogs.filter(b => b.id !== id))
        }
        setmessageClass('successful')
        setErrorMessage('blog deleted successfully')
        setTimeout(() => setErrorMessage(""), 5000)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      setmessageClass('error')
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(""), 5000)
    }
  }

  const updatedBlog = async (id) => {
    try {
      const returnedBlog = await blogService.updatedBlog(id)
      setBlogs(prevBlogs => {
        const updatedBlogs = prevBlogs.map(b => b.id !== id ? b : returnedBlog)
        return updatedBlogs.sort((a, b) => b.likes - a.likes)
      })
      setmessageClass('successful')
      setErrorMessage('You have successfully liked the blog')
      setTimeout(() => setErrorMessage(""), 5000)
    } catch (error) {
      console.error("Error when liking the blog:", error)
      setmessageClass('error')
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(""), 5000)
    }
  }

  return (
    <div>
      {user === null ? (
        <>
          <Notification message={errorMessage} messageClass={messageClass} />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            handleUsername={handleUsername}
            password={password}
            handlePassword={handlePassword}
          />
        </>
      ) : (
        <div>
          <Notification message={errorMessage} messageClass={messageClass} />
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          deleteBlog={deleteBlog}
          updatedBlog={updatedBlog}
          currentUser={user}
        />
      )}
    </div>
  )
}

export default App