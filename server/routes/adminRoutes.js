import express from 'express'
import { isLoggedIn, authorizedRole } from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'
import createError from '../utils/error.js'

const router = express.Router()

// Get all users
router.get('/users', isLoggedIn, authorizedRole('ADMIN'), async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        res.status(200).json({ success: true, users })
    } catch (error) {
        return next(createError(500, error.message))
    }
})

// Delete user
router.delete('/users/:id', isLoggedIn, authorizedRole('ADMIN'), async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return next(createError(404, 'User not found'))
        res.status(200).json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        return next(createError(500, error.message))
    }
})

// Update user role
router.put('/users/:id/role', isLoggedIn, authorizedRole('ADMIN'), async (req, res, next) => {
    try {
        const { role } = req.body
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
        if (!user) return next(createError(404, 'User not found'))
        res.status(200).json({ success: true, message: 'Role updated successfully', user })
    } catch (error) {
        return next(createError(500, error.message))
    }
})

export default router
