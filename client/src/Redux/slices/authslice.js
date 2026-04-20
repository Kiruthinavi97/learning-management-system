import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

import axiosInstance from '../../Helpers/axiosInstance'

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {}
}

export const signup = createAsyncThunk("/auth/signup", async (data) => {
    try {
        toast.loading("Wait! Creating your account", { position: 'top-center' });
        const response = await axiosInstance.post('/api/v1/user/signup', data);
        if (response.status === 201) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        toast.loading("Wait! login in your account", { position: 'top-center' });
        const response = await axiosInstance.post('/api/v1/user/login', data);
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        toast.loading("Wait! logout in progress", { position: 'top-center' });
        const response = await axiosInstance.get('/api/v1/user/logout');
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const forgotPassword = createAsyncThunk("/user/forgotPassword", async (data) => {
    try {
        toast.loading("Wait! sending request...", { position: 'top-center' });
        const response = await axiosInstance.post('/api/v1/user/forgot-password', data)
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const resetPassword = createAsyncThunk("/user/resetPassword", async (data) => {
    try {
        toast.loading("Wait! resetting password...", { position: 'top-center' });
        const response = await axiosInstance.post(`/api/v1/user/reset/${data.resetToken}`, {
            password: data.password
        });
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const changePassword = createAsyncThunk("/user/changePassword", async (data) => {
    try {
        toast.loading("Wait! changing password..", { position: 'top-center' });
        const response = await axiosInstance.put('/api/v1/user/change-password', data);
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const editProfile = createAsyncThunk("/user/editProfile", async (data) => {
    try {
        toast.loading("Wait! update profile", { position: 'top-center' });
        const response = await axiosInstance.put('/api/v1/user/update', data);
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const getProfile = createAsyncThunk("/user/myprofile", async () => {
    try {
        const response = await axiosInstance.get('/api/v1/user/myprofile');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const deleteProfile = createAsyncThunk("/user/deleteProfile", async (data) => {
    try {
        const response = await axiosInstance.delete('/api/v1/user/delete-profile', data);
        if (response.status === 200) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

// ✅ New: refresh profile after payment to update subscription status
export const refreshProfile = createAsyncThunk("/user/refreshProfile", async () => {
    try {
        const response = await axiosInstance.get('/api/v1/user/myprofile');
        return response.data;
    } catch (error) {
        throw error;
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // ✅ Allow manual subscription update from payment success
        updateSubscription: (state, action) => {
            state.data.subscription = action.payload
            localStorage.setItem("data", JSON.stringify(state.data))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("data", JSON.stringify(action?.payload?.userData));
            localStorage.setItem("role", action?.payload?.userData?.role);
            localStorage.setItem("token", action?.payload?.token);
            state.isLoggedIn = true
            state.data = action?.payload?.userData
            state.role = action?.payload?.userData?.role
        })

        builder.addCase(signup.fulfilled, (state, action) => {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("role", action?.payload?.user?.role);
            localStorage.setItem("token", action?.payload?.token);
            state.isLoggedIn = true
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        })

        builder.addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.data = {};
            state.role = "";
        })

        builder.addCase(getProfile.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            state.data = action?.payload?.user
        })

        builder.addCase(deleteProfile.fulfilled, (state) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.data = {};
            state.role = "";
        })

        // ✅ Update Redux + localStorage after payment success
        builder.addCase(refreshProfile.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            state.data = action?.payload?.user
        })
    }
})

export const { updateSubscription } = authSlice.actions
export default authSlice.reducer
