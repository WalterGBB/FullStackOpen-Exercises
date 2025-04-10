import PropTypes from "prop-types"

const LoginForm = ({ username, handleUsername, password, handlePassword, handleLogin }) => {
    return (
        <form onSubmit={handleLogin}>
            <h3>log in to application</h3>
            <div>
                <label htmlFor="username">username</label>
                <input
                    id="username"
                    type="text"
                    data-testid='username'
                    value={username}
                    onChange={handleUsername}
                />
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input
                    id="password"
                    type="password"
                    data-testid='password'
                    value={password}
                    onChange={handlePassword}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )
}

LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    handleUsername: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    handlePassword: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired
}

export default LoginForm
