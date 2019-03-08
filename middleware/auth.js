var jwt = require('jsonwebtoken')

exports.isAuthentication = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.SECRETT, function(err, decoded){
            if (err) {
                res.json({message:`Failed to authenticate token`})
            } else {
                req.decoded = decoded
                console.log(req.decoded)
                next()
            }
        })
    } else {
        return res.status(403).send({message:'No token provided.'})
    }
}