import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    good: 0,
    neutral: 0,
    bad: 0
}

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        voteGood: (state) => {
            state.good += 1
        },
        voteNeutral: (state) => {
            state.neutral += 1
        },
        voteBad: (state) => {
            state.bad += 1
        },
        reset: () => initialState
    }
})

export const { voteGood, voteNeutral, voteBad, reset } = feedbackSlice.actions
export default feedbackSlice.reducer
