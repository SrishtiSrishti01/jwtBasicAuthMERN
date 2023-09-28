import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from './models/user.js'
import jwt from 'jsonwebtoken'
import user from './models/user.js'
import { Auth } from './Auth.js'
import cors from 'cors'
import cookies from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(cookies())

dotenv.config()

const MONGODB_SERVER = process.env.MONGODB_SERVER
const PORT = process.env.PORT || 5000

app.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body
        bcrypt.hash(password, 10).then((hashedPassword) => {
            const user = new User({ username, email, password: hashedPassword })
            user.save()
            return res.status(201).send({ user })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

app.post('/login', (req, res) => {

    try {
        const { email, password } = req.body
        User.findOne({ email }).then((user) => {
            bcrypt.compare(password, user.password, (err, result) => {
                console.log(err)
                if (err || !result) return res.status(401).send(err || 'Wrong Password')
                const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: 10, })
                const refreshToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_REFRESH_SECRET)
                const { password, ...restParams } = user._doc
                console.log(refreshToken + "--------")


                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    domain: 'localhost',
                    maxAge: 100000,
                    sameSite: 'none', // Set to 'none' for cross-site cookies
                    secure: true, 
                })
                res.json({ user: restParams, token })
                // return res.status(201).send({user : restParams, token})
            })
        }).catch(err => {
            return res.status(404).send('cannot find user')
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

app.get('/refresh', (req, res) => {
    try {
        // const {user} = req
        // const token = jwt.sign({id : user.id, username : user.username}, process.env.JWT_SECRET, {expiresIn: 10})
        // return res.status(201).send(token)
        // console.log(JSON.stringify(req.headers)+"()()()()()()()()()())()()()((()");
        console.log({...req}, "(((())))))))))");

        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;

            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Unauthorized token' })
                } else {
                    console.log(decoded)
                    const accessToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, { expiresIn: 10 })
                    return res.status(201).send(accessToken)
                }
            })
        } else {
            return res.status(406).json({ message: 'Unauthorized No Token' })
        }

    } catch (error) {
        console.log(error)

        return res.status(500).send({ error })
    }
})

app.get('/protected', Auth, (req, res) => {

    try {
        return res.status(201).send('protected')
    } catch (error) {
        return res.status(500).send(error)

    }
})


mongoose.connect(MONGODB_SERVER).then(() => {
    app.listen(PORT, () => {
        console.log('server is running')
    })
}).catch(err => {
    console.log(err)
}) 
