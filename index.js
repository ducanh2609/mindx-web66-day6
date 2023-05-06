const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const jwt = require('jsonwebtoken')
const { users, userModel } = require('./models/user')

const app = express()

app.use(express.json())

const authenticationCheck = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, '123@lol');
    const { username } = decoded
    // Check user co trong co so du lieu khong 
    const user = await userModel.find({ username: username })
    if (user && user.length > 0) {
        req.user = user
        next()
    } else {
        res.send('User khong ton tai')
    }
}

app.use('/users', authenticationCheck, userRouter)
// app.use('/song', songRouter)

app.get('/', (req, res) => {
    res.send('Home router')
})

app.post('/login', authenticationCheck, (req, res) => {
    const { username, password } = req.body
    const token = jwt.sign({ username: username }, '123@lol')
    // Tra token cho client
    res.send({ token: token })
})

app.listen(3000)
console.log('Server running')