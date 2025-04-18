import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import anecdotesService from '../services/anecdotes'
import { useDispatch, useSelector } from 'react-redux'
import Filter from './Filter'
import Notification from './Notification'
import { useNotification } from '../context/NotificationContext'

const AnecdoteList = () => {
    const dispatchRedux = useDispatch() // Solo para el filtro
    const filter = useSelector(state => state.filter)
    const queryClient = useQueryClient()
    const [, dispatchNotification] = useNotification()

    const { data: anecdotes, isLoading, isError } = useQuery({
        queryKey: ['anecdotes'],
        queryFn: anecdotesService.getAll,
        retry: false
    })

    const voteMutation = useMutation({
        mutationFn: anecdotesService.update,
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            const updated = anecdotes.map(a =>
                a.id === updatedAnecdote.id ? updatedAnecdote : a
            )
            queryClient.setQueryData(['anecdotes'], updated)

            dispatchNotification({
                type: 'SHOW',
                payload: `You voted '${updatedAnecdote.content}'`
            })
            setTimeout(() => dispatchNotification({ type: 'HIDE' }), 5000)
        }
    })

    const handleVote = (anecdote) => {
        voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>anecdote service not available due to problems in server</div>

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    const filteredAnecdotes = sortedAnecdotes.filter(a =>
        a.content.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            <h2>Anecdotes</h2>
            <Notification />
            <Filter />
            {filteredAnecdotes.map(anecdote =>
                <p key={anecdote.id}>
                    {anecdote.content} <br />
                    has {anecdote.votes} votes.
                    <button onClick={() => handleVote(anecdote)}>vote</button>
                </p>
            )}
        </div>
    )
}

export default AnecdoteList
