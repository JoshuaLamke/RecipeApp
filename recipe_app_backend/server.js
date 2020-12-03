//Require Express and create app
let express = require('express');
let app = express();

//Import database
let db = require('./database');

//Require md5 (for password hashing)
let md5 = require('md5');

//Import body parser for post requests
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Define a port
let port = 8080;

//Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

//Define root
app.get("/",(req, res, next) => {
    res.send({message: "connected"});
});

// Get a user based on email and password
// Used for getting user info after they log in to the app
app.get("/api/user/:email/:password", (req, res) => {
    console.log(req.params.password);
    console.log(req.params.email);
    let sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    let params = [req.params.email, md5(req.params.password)];
    let data;
    db.all(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        else {
            if(!row) {
                res.status(404).send({"error": "Could not find user with that login information, try again or sign up."});
            }
            else{
                data = row;
                res.json({
                    "message": "Success",
                    "data":row
                });
            }
        }
    })
})

// Get recipes useing a user's id 
// Used to load the recipies for the user after they log in
app.get("/api/recipes/:id", (req, res) => {
    let sql = "SELECT * FROM recipe WHERE userId = ?";
    let params = [req.params.id];
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({
                "error": err
            });
            return;
        }
        else{
            res.json({
                "recipes": rows
            });
        }
    });
})

// Get user based on the user's id 
// Not very useful but just there in case it is needed
app.get("/api/user/:id", (req, res) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Get all users
// Again not very useful but there if needed
app.get("/api/users", (req, res) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Create a new user
// Used for creating a new profile when the user signs up
app.post("/api/user/", (req, res) => {
    let errors = [];
    if(!req.body.password) {
        errors.push("No password specified.");
    }
    if(!req.body.email) {
        errors.push("No email specified.");
    }
    if(!req.body.name) {
        errors.push("No name specified.");
    }
    if(errors.length !== 0) {
        res.status(400).json({
            "error":errors
        })
    }
    else{
        let data = {
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password)
        }
        let sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
        let params = [data.name, data.email, data.password];
        db.run(sql, params, function(err, result) {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                res.json({
                    "message": "success",
                    "data": data,
                    "id": this.lastID
                });
            }
        });
    }
})

// Create a new recipe
// Used when the user wants to save a new recipe
app.post("/api/recipe/", (req, res) => {
    let errors = [];
    console.log(req.body);
    if(!req.body.userId) {
        errors.push("No user-id specified.");
    }
    if(!req.body.name) {
        errors.push("No name specified.");
    }
    if(!req.body.type) {
        errors.push("No type specified.");
    }
    if(!req.body.servingAmount) {
        errors.push("No serving size specified.");
    }
    if(!req.body.ingredients) {
        errors.push("No ingredients specified.");
    }
    if(!req.body.directions) {
        errors.push("No directions specified.");
    }
    if(errors.length != 0) {
        res.status(400).json({
            "Message": "error",
            "errors": errors
        });
    }
    else {
        let data = {
            "userId": req.body.userId,
            "name": req.body.name,
            "type": req.body.type,
            "servingAmount": req.body.servingAmount,
            "ingredients": req.body.ingredients,
            "directions": req.body.directions
        }
        let sql = "INSERT INTO recipe (userId, name, type, servingAmount, ingredients, directions) VALUES (?,?,?,?,?,?)";
        let params = [data.userId, data.name, data.type, data.servingAmount, data.ingredients, data.directions];
        db.run(sql, params, function(err, result) {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                res.json({
                    "message": "success",
                    "data": data,
                    "ID": this.lastID
                }); 
            }
        })
    }
})

// All other endpoints should give 404 status
app.use((req, res) => {
    res.status(404);
})