import jwt from 'jsonwebtoken'

export const Auth = (req, res, next) => {
    try {

        const tokenHeader = req.get('Authorization')
        if(!tokenHeader) res.status(401).send('There is no token')
        const token = tokenHeader.split('Bearer ')[1]
        console.log(token)
        const jwtSecret = req.originalUrl.includes('refresh') ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET

        jwt.verify(token, jwtSecret, (err, user) => {
            if(err && err?.name === 'TokenExpiredError') return res.status(403).send('Token Expired')
            if(err) return res.status(401).send('Invalid Token')
            req.user  = user
            next()
        })

    } catch(err) {
        console.log(err)
        return res.status(401).send('Unauthorized')
    }

}