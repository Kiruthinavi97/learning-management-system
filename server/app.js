import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import NodeCache from 'node-cache'

import userRoutes from './routes/userRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import miscRoutes from './routes/miscellaneousRoutes.js'
import tutorRoutes from './routes/tutorRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js'

dotenv.config()
const app = express()
export const myCache = new NodeCache()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://lmsguga.netlify.app"
    ],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payments", paymentRoutes)
app.use("/api/v1", miscRoutes)
app.use("/api/v1/tutor", tutorRoutes)
app.use("/api/v1/booking", bookingRoutes)
app.use("/api/v1/admin", adminRoutes)

app.use("/ping", (req, res) => {
    res.send("Server is working")
})

app.all("*", (req, res) => {
    res.status(404).send("!oops page not found")
})

app.use(errorMiddleware)

export default app
