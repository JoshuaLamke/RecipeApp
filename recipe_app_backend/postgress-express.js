//Require Express and create app
let express = require('express');
let cors = require('cors')
let app = express();

//Import database
let db = require('./postressdb');

//require cors middleware 
let corsOptions = {
    origin: 'https://recipe-app-jg.netlify.app/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

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
app.get("/", (req, res, next) => {
    var sql = "select NOW() from users"
    db.query(sql, (err, response) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success, connected to database",
            "time": response.rows[0]
        })
      });
});

// Get a user based on email and password
// Used for getting user info after they log in to the app
app.post("/api/user/login", cors(corsOptions), (req, res) => {
    let sql = "SELECT * FROM users WHERE email = $1 AND password = $2";
    let params = [req.body.email, md5(req.body.password)];
    let userInfo;
    let userId;
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        else {
            if(!response.rows) {
                res.status(404).send({"error": "Could not find user with that login information, try again or sign up."});
            }
            else{
                let row = response.rows[0]
                const token = jwt.sign({id: row.id}, process.env.SECRET);
                userId = row.id;
                userInfo = {
                    "message": "Success",
                    "data": row,
                    "Token": token
                };
                console.log(userInfo)
                sql = `SELECT * FROM recipe WHERE userId = ${userId}`;
                db.query(sql, (err, response) => {
                    if(err) {
                        res.status(400).json({
                            "error": err
                        });
                        return;
                    }
                    else{
                        res.json({
                            "User Info": userInfo,
                            "User Recipes": response.rows
                        });
                    }
                });
            }
        }
    })
    

})

// Get user based on the user's id 
// Not very useful but just there in case it is needed
app.get("/api/user/:id", cors(corsOptions), (req, res) => {
    var sql = "SELECT * FROM users WHERE id = $1"
    var params = [req.params.id]
    db.query(sql, params, (err, response) => {
        if (err) {
          res.status(400).json({"error": err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":response.rows[0]
        })
      });
});

// Get all users
// Again not very useful but there if needed
app.get("/api/users", cors(corsOptions),(req, res) => {
    var sql = "select * from users"
    var params = []
    db.query(sql, params, (err, response) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":response.rows
        })
      });
});

// Create a new user
// Used for creating a new profile when the user signs up
app.post("/api/user/signup", cors(corsOptions),(req, res) => {
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
        let sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
        let params = [data.name, data.email, data.password];
        db.query(sql, params, function(err, result) {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                const token = jwt.sign({id: result.rows[0].id}, process.env.SECRET);
                res.json({
                    "message": "success",
                    "data": data,
                    "id": result.rows[0].id,
                    "token": token
                });
            }
        });
    }
})

// Update a User's name. Pass in the new name and the id of the user.
// Used when the user would like to change their name. Be sure to check if the name is empty and not let them update it like that.
app.post("/api/user/update", cors(corsOptions), auth, (req, res) => {
    let sql = "UPDATE users SET name = $1 WHERE id = $2";
    let params = [req.body.name, req.user.id];
    db.query(sql, params, (err) => {
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
app.delete("/api/user/delete",cors(corsOptions), auth, (req, res) => {
    let sql = "DELETE FROM users WHERE email = $1 AND password = $2";
    let params = [req.user.email, req.user.password];
    console.log(req.user)
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({
                "error": err.message
            });
        }
        else {
            if(response.rowCount != 0){
                res.json({
                    "Message": "Account successfully deleted.",
                    "response": response
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
app.get("/api/recipes",cors(corsOptions), auth, (req, res) => {
    let sql = "SELECT * FROM recipe WHERE userId = $1";
    let params = [req.user.id];
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({
                "error": err
            });
            return;
        }
        else{
            res.json({
                "recipes": response.rows
            });
        }
    });
})

// Get all recipes
app.get("/api/allrecipes", cors(corsOptions), (req, res) => {
    var sql = "SELECT * FROM recipe"
    db.query(sql, (err, response) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":response.rows
        })
      });
});

// Create a new recipe
// Used when the user wants to save a new recipe
app.post("/api/recipe/",cors(corsOptions), auth, (req, res) => {
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
        let sql = "INSERT INTO recipe (userId, name, type, servingAmount, ingredients, directions) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id";
        let params = [data.userId, data.name, data.type, data.servingAmount, data.ingredients, data.directions];
        db.query(sql, params, (err, response) => {
            if(err) {
                res.status(400).json({
                    "error": err
                });
            }
            else{
                res.json({
                    "message": "success",
                    "data": data,
                    "ID": response.rows[0].id
                }); 
            }
        })
    }
})

// Updates a recipe based on its id.
// Use when user wants to update their recipe.
app.post("/api/recipe/update", cors(corsOptions), auth, (req, res) => {
    let name = req.body.name;
    let type = req.body.type;
    let servingAmount = req.body.servingAmount;
    let ingredients = req.body.ingredients;
    let directions = req.body.directions;
    let id = req.body.id;
    let sql = "UPDATE recipe SET name = $1, type = $2, servingAmount = $3, ingredients = $4, directions = $5 WHERE id = $6";
    let params = [name, type, servingAmount, ingredients, directions, id];
    let data = {
        name: name,
        type: type,
        servingAmount: servingAmount,
        ingredients: ingredients,
        directions: directions,
        id: id
    }
    db.query(sql, params, (err, response) => {
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
app.delete("/api/recipe/:id", cors(corsOptions), auth, (req, res) => {
    let sql = "DELETE FROM recipe WHERE id = $1";
    let params = [req.params.id];
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({
                "Error": err.message
            });
        }
        else{
            if(response.rowCount != 0) {
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
app.delete("/api/recipes", cors(corsOptions), (req, res) => {
    let sql = "DELETE FROM recipe";
    let params = [];
    db.query(sql, params, (err, response) => {
        if(err) {
            res.status(400).json({
                "Error": err.message
            });
        }
        else {
            res.json({
                "Message": `${response.rowCount} recipes deleted`
            });
        }
    })
})

// All other endpoints should give 404 status
app.use((req, res) => {
    res.status(404);
})