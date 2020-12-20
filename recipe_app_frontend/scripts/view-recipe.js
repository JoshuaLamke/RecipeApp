const titleElement = document.querySelector('#recipe-name')
const typeElement = document.querySelector('#recipe-type')
const servingsElement = document.querySelector('#recipe-servings')
const ingredientsElement = document.querySelector('#recipe-ingredients')
const directionsElement = document.querySelector('#recipe-directions')
const recipeID = location.hash.substring(1)

let recipeList = []
var userToken = localStorage.getItem("token")
fetch('http://localhost:8081/api/recipes', {
    method: 'GET',
    headers: {
        "Authorization": "Bearer " + userToken,
        "Content-Type": "application/json"
    }
}).then((response) => {
    response.json().then(function (actualResponse) {
        if ((actualResponse.status) && actualResponse.status !== 200) {
            console.log('Something is not right')
            console.log(actualResponse.status)
        }
        recipeList = actualResponse.recipes
        let wantedRecipe = recipeList.find(function (recipe) {
            return recipe.id == recipeID
        })
        // In case from some reason we can't find the recipe, it will return the user to the previous page
        if (!wantedRecipe){
            location.assign('/user.html')
            alert("Sorry! Looks like there was a mistake")
        }
        titleElement.textContent = wantedRecipe.name
        typeElement.textContent = "Type: " + wantedRecipe.type
        servingsElement.textContent = "Number of servings: " + wantedRecipe.servingAmount
        ingredientsElement.textContent = "Ingredients: " + wantedRecipe.ingredients
        directionsElement.textContent = wantedRecipe.directions
    })
})

//If the user clicks the delete button it will delete the recipe
document.querySelector('#recipe-delete').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch("http://localhost:8081/api/recipe/" + recipeID, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + userToken,
            "Content-Type": "application/json"
        }
    }).then((response) => {
        response.json().then(function (actualResponse) {
            console.log(actualResponse)
            location.assign('/user.html')
        })
    })
})

document.querySelector('#recipe-edit').addEventListener('submit', (e) => {
    e.preventDefault()
    location.assign(`/edit-recipe.html#${recipeID}`)
})