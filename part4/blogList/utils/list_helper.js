const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const favorite = blogs.reduce((prev, current) =>
        current.likes > prev.likes ? current : prev
    )

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})

    const topAuthor = Object.keys(authorCounts).reduce((top, author) => {
        if (authorCounts[author] > top.blogs) {
            return { author, blogs: authorCounts[author] }
        }
        return top
    }, { author: null, blogs: 0 })

    return topAuthor
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const likesByAuthor = blogs.reduce((likes, blog) => {
        likes[blog.author] = (likes[blog.author] || 0) + blog.likes
        return likes
    }, {})

    const topAuthor = Object.keys(likesByAuthor).reduce((top, author) => {
        if (likesByAuthor[author] > top.likes) {
            return { author, likes: likesByAuthor[author] }
        }
        return top
    }, { author: null, likes: 0 })

    return topAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
