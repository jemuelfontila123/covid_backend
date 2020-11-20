const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./services/config')
const middleware = require('./services/middleware')
const userRouter = require('./routes/userRoute')
mongoose.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// CORS
// app.use(cors())
app.use(express.json())


app.use('/users', userRouter);


module.exports = app;