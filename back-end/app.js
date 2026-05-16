require('dotenv').config()

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173']

const express = require('express')
const { app, server } = require('./utils/socket')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const connectDB = require('./connect')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const placeRouter = require('./routes/placeRoutes')
const messageRouter = require('./routes/messageRoutes')
const applyRouter = require('./routes/placeRoutes')
const reservationRouter = require('./routes/reservationRoutes')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

app.use(morgan("tiny"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.static('images'))


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/places', placeRouter)
app.use('/api/v1/messages', messageRouter)
app.use('/api/v1/apply', applyRouter)
app.use('/api/v1/reservation', reservationRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        server.listen(5000, console.log("Server is running on port 5000"))
    } catch (error) {
        console.log(error)
    }
}

start()