import { createSlice } from '@reduxjs/toolkit'

let timeoutId

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        show(state, action) {
            return action.payload
        },
        hide() {
            return ''
        }
    }
})

export const { show, hide } = notificationSlice.actions

export const setNotification = (message, seconds) => {
    return async (dispatch) => {
        clearTimeout(timeoutId)
        dispatch(show(message))
        timeoutId = setTimeout(() => {
            dispatch(hide())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer