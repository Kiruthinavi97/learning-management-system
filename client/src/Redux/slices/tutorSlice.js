import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helpers/axiosInstance'

const initialState = {
    isLoggedIn: false,
    role: '',
    data: {}
}

export const tutorSignup = createAsyncThunk('/tutor/signup', async (data) => {
    try {
        const response = axiosInstance.post('/api/v1/tutor/signup', data)
        toast.promise(response, {
            pending: 'Creating your tutor account...',
            success: 'Account created successfully!',
            error: 'Failed to create account'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const tutorLogin = createAsyncThunk('/tutor/login', async (data) => {
    try {
        const response = axiosInstance.post('/api/v1/tutor/login', data)
        toast.promise(response, {
            pending: 'Logging in...',
            success: 'Login successful!',
            error: 'Failed to login'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const tutorLogout = createAsyncThunk('/tutor/logout', async () => {
    try {
        const response = axiosInstance.get('/api/v1/tutor/logout')
        toast.promise(response, {
            pending: 'Logging out...',
            success: 'Logged out successfully!',
            error: 'Failed to logout'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const getTutorProfile = createAsyncThunk('/tutor/profile', async () => {
    try {
        const response = await axiosInstance.get('/api/v1/tutor/profile/me')
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const updateTutorProfile = createAsyncThunk('/tutor/update', async (data) => {
    try {
        const response = axiosInstance.put('/api/v1/tutor/update', data)
        toast.promise(response, {
            pending: 'Updating profile...',
            success: 'Profile updated successfully!',
            error: 'Failed to update profile'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

const tutorSlice = createSlice({
    name: 'tutor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tutorSignup.fulfilled, (state, action) => {
                if (action?.payload?.success) {
                    state.isLoggedIn = true
                    state.role = 'TUTOR'
                    state.data = action?.payload?.tutor
                }
            })
            .addCase(tutorLogin.fulfilled, (state, action) => {
                if (action?.payload?.success) {
                    state.isLoggedIn = true
                    state.role = 'TUTOR'
                    state.data = action?.payload?.tutor
                }
            })
            .addCase(tutorLogout.fulfilled, (state) => {
                state.isLoggedIn = false
                state.role = ''
                state.data = {}
            })
            .addCase(getTutorProfile.fulfilled, (state, action) => {
                if (action?.payload?.success) {
                    state.data = action?.payload?.tutor
                    state.isLoggedIn = true
                    state.role = 'TUTOR'
                }
            })
    }
})

export default tutorSlice.reducer
