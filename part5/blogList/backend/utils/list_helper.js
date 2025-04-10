/*
 * Función auxiliar que devuelve siempre 1
 * @param {Array} blogs - Lista de blogs (actualmente no utilizada)
 * @returns {number} - Siempre devuelve 1
 */

const dummy = (blogs) => {
    return 1
}

/*
 * Calcula la suma total de likes de una lista de blogs.
 * @param {Array} blogs - Lista de blogs
 * @returns {number} - Suma total de likes
 */

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

/**
 * Encuentra el blog con más likes en una lista.
 * @param {Array} blogs - Lista de blogs
 * @returns {Object|null} - Blog con más likes (o null si la lista está vacía)
 */
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // Encontrar el blog con más likes
    const favorite = blogs.reduce((prev, current) =>
        current.likes > prev.likes ? current : prev
    )

    // Devolver sólo las propiedades relevantes
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}

/*
 * Encuentra el autor con la mayor cantidad de blogs.
 * @param {Array} blogs - Lista de blogs
 * @returns {Object|null} - Autor con más blogs y el número de blogs (o null si la lista está vacía)
 */
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // Contar blogs por autor
    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})

    // Encontrar el autor con más blogs
    const topAuthor = Object.keys(authorCounts).reduce((top, author) => {
        if (authorCounts[author] > top.blogs) {
            return { author, blogs: authorCounts[author] }
        }
        return top
    }, { author: null, blogs: 0 })

    return topAuthor
}

/*
 * Encuentra el autor con la mayor cantidad total de likes en sus blogs.
 * @param {Array} blogs - Lista de blogs
 * @returns {Object|null} - Autor con más likes y la suma total de likes (o null si la lista está vacía)
 */
const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // Calcular el total de likes por autor
    const likesByAuthor = blogs.reduce((likes, blog) => {
        likes[blog.author] = (likes[blog.author] || 0) + blog.likes
        return likes
    }, {})

    // Encontrar el autor con más likes
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
