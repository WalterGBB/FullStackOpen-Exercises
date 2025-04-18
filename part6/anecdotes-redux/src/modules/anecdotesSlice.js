import { createSlice } from '@reduxjs/toolkit'
// import { v4 as uuidv4 } from 'uuid'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        updateAnecdote(state, action) {
            const updated = action.payload
            return state.map(a =>
                a.id === updated.id ? updated : a
            )
        }
    }
})

export const { appendAnecdote, updateAnecdote } = anecdoteSlice.actions

export const fetchAnecdotes = () => {
    return async (dispatch) => {
        const anecdotes = await anecdotesService.getAll()
        anecdotes.forEach(anecdote => {
            dispatch(appendAnecdote(anecdote))
        })
    }
}

export const voteAnecdote = (anecdote) => {
    return async (dispatch) => {
        const updated = { ...anecdote, votes: anecdote.votes + 1 }
        const response = await anecdotesService.update(updated)
        dispatch(updateAnecdote(response))
    }
}

export const createAnecdote = (content) => {
    return async (dispatch) => {
        const newAnecdote = await anecdotesService.create({
            content,
            votes: 0
        })
        dispatch(appendAnecdote(newAnecdote))
    }
}

export default anecdoteSlice.reducer