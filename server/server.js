import app from "./app.js";
import { connectDb } from './database/db.js'
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})

app.use("/test", (req, res) => {
    res.json({ cors: app._router ? "router exists" : "no router", working: true })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    connectDb()
    console.log(`server is running on port ${PORT}`);
})