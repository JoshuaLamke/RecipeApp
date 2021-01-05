const jwt = require("jsonwebtoken");
let db = require("../postressdb");
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
    db.query(`Select * FROM users WHERE id = ${id}`, (err, response) => {
        if(!response.rows) {
            res.status(401).send({
                "Error": "Cannot find user"
            });
        }
        else {
            req.user = response.rows[0];
            next();
        }
    })
}
module.exports = authenticate 