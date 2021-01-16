const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./services/config')
const middleware = require('./services/middleware')
const userRouter = require('./routes/userRoute')
const smsRouter = require('./routes/smsRoute')
const establishmentRouter = require('./routes/establishmentRoute')
mongoose.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
// CORS
app.use(cors())
app.use(express.json())
app.use(middleware.getToken)
app.use('/sms', smsRouter)
app.use('/establishments',establishmentRouter)
app.use('/users', userRouter);
app.use(middleware.errorHandler)


module.exports = app;