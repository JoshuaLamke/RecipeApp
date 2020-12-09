const jwt = require("jsonwebtoken");
let db = require("../database");
const authenticate = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch(err) {
        res.status(400).json({"Error": "Please Authenticate"})
    }
    if(!decodedToken){return;}
    const id = decodedToken.id;
    db.get(`Select * FROM user WHERE id = ${id}`, (err, row) => {
        if(!row) {
            res.status(401).send({
                "Error": "Cannot find user"
            });
        }
        else {
            req.user = row;
            next();
        }
    })
}
module.exports = authenticate 