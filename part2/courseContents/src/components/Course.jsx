const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
}

const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({ course }) => {
    return (
        <>
            {
                course.parts.map(part => {
                    return (
                        <Part key={part.id} part={part}></Part>
                    )
                })
            }
        </>
    )
}

const Total = ({ course }) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <b>total of {total} exercises</b>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course}></Header>
            <Content course={course}></Content>
            <Total course={course}></Total>
        </>
    )
}

export default Course