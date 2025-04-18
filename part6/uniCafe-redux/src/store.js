// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import feedbackReducer from './modules/feedbackSlice'

const store = configureStore({
    reducer: {
        feedback: feedbackReducer
    }
})

export default store