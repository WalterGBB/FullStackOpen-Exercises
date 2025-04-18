import feedbackReducer, {
    voteGood,
    voteNeutral,
    voteBad,
    reset
} from '../modules/feedbackSlice'

describe('feedback reducer', () => {
    const initialState = {
        good: 0,
        neutral: 0,
        bad: 0
    }

    test('should return the initial state when called with undefined state', () => {
        const state = undefined
        const action = { type: 'unknown' }
        const newState = feedbackReducer(state, action)
        expect(newState).toEqual(initialState)
    })

    test('should increment good', () => {
        const state = initialState
        const newState = feedbackReducer(state, voteGood())
        expect(newState).toEqual({ good: 1, neutral: 0, bad: 0 })
    })

    test('should increment neutral', () => {
        const state = initialState
        const newState = feedbackReducer(state, voteNeutral())
        expect(newState).toEqual({ good: 0, neutral: 1, bad: 0 })
    })

    test('should increment bad', () => {
        const state = initialState
        const newState = feedbackReducer(state, voteBad())
        expect(newState).toEqual({ good: 0, neutral: 0, bad: 1 })
    })

    test('should reset all values', () => {
        const modifiedState = { good: 3, neutral: 2, bad: 1 }
        const newState = feedbackReducer(modifiedState, reset())
        expect(newState).toEqual(initialState)
    })
})
