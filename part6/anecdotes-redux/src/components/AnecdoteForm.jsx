import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdotesService from '../services/anecdotes'
import { useNotification } from '../context/NotificationContext'

const AnecdoteForm = () => {
    const queryClient = useQueryClient()
    const [, dispatchNotification] = useNotification()

    const newAnecdoteMutation = useMutation({
        mutationFn: anecdotesService.createAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

            dispatchNotification({
                type: 'SHOW',
                payload: `You created '${newAnecdote.content}'`
            })
            setTimeout(() => dispatchNotification({ type: 'HIDE' }), 5000)
        },
        onError: (error) => {
            dispatchNotification({
                type: 'SHOW',
                payload: 'Anecdote content must be at least 5 characters long'
            })
            setTimeout(() => dispatchNotification({ type: 'HIDE' }), 5000)
        }
    })

    const addAnecdote = (e) => {
        e.preventDefault()
        const content = e.target.anecdote.value.trim()
        e.target.anecdote.value = ''

        // Ya no hacemos validación local, se maneja en onError
        newAnecdoteMutation.mutate({ content, votes: 0 })
    }

    return (
        <form onSubmit={addAnecdote}>
            <input name="anecdote" />
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm