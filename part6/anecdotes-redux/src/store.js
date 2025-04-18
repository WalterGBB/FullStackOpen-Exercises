import { configureStore } from '@reduxjs/toolkit'
// import anecdotesReducer from './modules/anecdotesSlice'
import filterReducer from './modules/filterSlice'
import notificationReducer from './modules/notificationSlice'

const store = configureStore({
    reducer: {
        // anecdotes: anecdotesReducer,
        filter: filterReducer,
        notification: notificationReducer
    },
})

export default store