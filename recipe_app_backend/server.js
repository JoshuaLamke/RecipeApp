//Require Express and create app
let express = require('express');
let app = express();

//Import database
let db = require('./database');

//Require md5 (for password hashing)
let md5 = require('md5');

//Require jsonwebtoken for authentication
let jwt = require('jsonwebtoken');

//Require auth method for user authentication with jwt
let auth = require('./middleware/auth');

//Require dotenv for keeping environment variables
require('dotenv').config();

//Import body parser for post requests
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});

//Define root
app.get("/",(req, res, next) => {
    res.send({message: "connected"});
});

// Get a user based on email and password
// Used for getting user info after they log in to the app
app.post("/api/user/login", (req, res) => {
    let sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    let params = [req.body.email, md5(req.body.password)];
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        else {
            if(!row) {
                res.status(404).send({"error": "Could not find user with that login information, try again or sign up."});
            }
            else{
                const token = jwt.sign({id: row.id}, process.env.SECRET);
                res.json({
                    "message": "Success",
                    "data": row,
                    "Token": token
                });
            }
        }
    })
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
app.post("/api/user/signup", (req, res) => {
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
                const token = jwt.sign({id: this.lastID}, process.env.SECRET);
                res.json({
                    "message": "success",
                    "data": data,
                    "id": this.lastID,
                    "token": token
                });
            }
        });
    }
})

// Update a User's name. Pass in the new name and the id of the user.
// Used when the user would like to change their name. Be sure to check if the name is empty and not let them update it like that.
app.post("/api/user/update", auth, (req, res) => {
    let sql = "UPDATE user SET name = ? WHERE id = ?";
    let params = [req.body.name, req.user.id];
    db.get(sql, params, (err) => {
        if(err) {
            res.status(400).json({
                "error": err.message
            })
        }
        else{
            res.json({
                "Success": `Name updated to ${req.body.name}`
            })
        }
    });
});

// Delete a User
// Used when the user wants to delete their account, pass in their username and password to delete
app.delete("/api/user/delete", auth, (req, res) => {
    db.get("PRAGMA foreign_keys = ON");
    let sql = "DELETE FROM user WHERE email = ? AND password = ?";
    let params = [req.user.email, req.user.password];
    db.run(sql, params, function(err) {
        if(err) {
            res.status(400).json({
                "error": err.message
            });
        }
        else {
            if(this.changes != 0){
                res.json({
                    "Message": "Account successfully deleted."
                });
            }
            else{
                res.status(400).json({
                    "Message": "Incorrect username or password."
                });
            }
        }
    })
});

// Get recipes using a user's id 
// Used to load the recipies for the user after they log in
app.get("/api/recipes", auth, (req, res) => {
    let sql = "SELECT * FROM recipe WHERE userId = ?";
    let params = [req.user.id];
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

// Get all recipes
app.get("/api/allrecipes", (req, res) => {
    var sql = "SELECT * FROM recipe"
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

// Create a new recipe
// Used when the user wants to save a new recipe
app.post("/api/recipe/", auth, (req, res) => {
    let errors = [];
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
            "userId": req.user.id,
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

// Updates a recipe based on its id.
// Use when user wants to update their recipe.
app.post("/api/recipe/update", auth, (req, res) => {
    let name = req.body.name;
    let type = req.body.type;
    let servingAmount = req.body.servingAmount;
    let ingredients = req.body.ingredients;
    let directions = req.body.directions;
    let id = req.body.id;
    let sql = "UPDATE recipe SET name = ?, type = ?, servingAmount = ?, ingredients = ?, directions = ? WHERE id = ?";
    let params = [name, type, servingAmount, ingredients, directions, id];
    let data = {
        name: name,
        type: type,
        servingAmount: servingAmount,
        ingredients: ingredients,
        directions: directions,
        id: id
    }
    db.get(sql, params, (err) => {
        if(err) {
            res.status(400).json({
                "error": err.message
            })
        }
        else {
            res.json({
                "Message": "Updated recipe successfully",
                "Data": data
            });
        }
    });
});

// Deletes a recipe based on the id
// Used for when a user wants to delete a certain recipe
app.delete("/api/recipe/:id", auth, (req, res) => {
    let sql = "DELETE FROM recipe WHERE id = ?";
    let params = [req.params.id];
    db.run(sql, params, function(err) {
        if(err) {
            res.status(400).json({
                "Error": err.message
            });
        }
        else{
            if(this.changes != 0) {
                res.json({
                    "Message": "Recipe was deleted"
                });
            }
            else {
                res.status(400).json({
                    "Message": "Input correct recipe id"
                });
            }
        }
    })
})

// Deletes all recipes in the database
app.delete("/api/recipes", (req, res) => {
    let sql = "DELETE FROM recipe";
    let params = [];
    db.run(sql, params, function(err) {
        if(err) {
            res.status(400).json({
                "Error": err.message
            });
        }
        else {
            res.json({
                "Message": `${this.changes} recipes deleted`
            });
        }
    })
})

// All other endpoints should give 404 status
app.use((req, res) => {
    res.status(404);
})