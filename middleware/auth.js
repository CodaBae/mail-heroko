const jwt = require('jsonwebtoken')
const config = require('config')

function auth (req,res,next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied')

    try{
        const decode = jwt.verify(token,config.get('jwtPrivateKey'))
     req.user = decode
     next()
    }catch (err){
        res.status(400).send(err,'Invaild token')
    }
}

module.exports.auth = auth