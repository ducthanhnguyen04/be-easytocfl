const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        return res.sendStatus(401).json({message: 'Unauthorized'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403).json({message: 'Forbidden'});
        }
        req.user = user;
        next();
    }); 
}

module.exports = authMiddleware;