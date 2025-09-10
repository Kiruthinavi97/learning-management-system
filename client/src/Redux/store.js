import { configureStore } from '@reduxjs/toolkit'

import authSlice from './slices/authslice'
import courseSlice from './slices/courseslice'
import lectureSlice from './slices/lectureslice'
import razorpaySlice from './slices/razorpayslice'
import statSlice from './slices/statslice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        course: courseSlice,
        razorpay: razorpaySlice,
        lecture: lectureSlice,
        stat: statSlice
    },
    devTools: true
})


export default store