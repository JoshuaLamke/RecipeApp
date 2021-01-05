const recipeID = location.hash.substring(1)
let recipeData = {
    name: '',
    type: '',
    servingAmount: '',
    ingredients: '',
    directions: '',
    id: recipeID
}
const titleElement = document.querySelector('#title-bar')
const typeElement = document.querySelector('#type-bar')
const servingsElement = document.querySelector('#serving-amount-bar')
const ingredientsElement = document.querySelector('#ingredients-bar')
const directionsElement = document.querySelector('#directions-bar')

let recipeList = []
var userToken = localStorage.getItem("token")

fetch('https://recipe-app-jg.herokuapp.com/api/recipes', {
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
        titleElement.value = wantedRecipe.name
        typeElement.value = wantedRecipe.type
        servingsElement.value = wantedRecipe.servingAmount
        ingredientsElement.value = wantedRecipe.ingredients
        directionsElement.value = wantedRecipe.directions

        recipeData.name = wantedRecipe.name
        recipeData.type = wantedRecipe.type
        recipeData.servingAmount = wantedRecipe.servingAmount
        recipeData.ingredients = wantedRecipe.ingredients
        recipeData.directions = wantedRecipe.directions
    })
})

document.querySelector('#recipe-edit').addEventListener('submit', (e) => {
    e.preventDefault()
    recipeData.name = e.target[0].value
    recipeData.type = e.target[1].value
    recipeData.servingAmount = e.target[2].value
    console.log(recipeData.servingAmount)
    recipeData.ingredients = e.target[3].value
    recipeData.directions = e.target[4].value
    let userID = localStorage.getItem("id")
    fetch("https://recipe-app-jg.herokuapp.com/api/recipe/update", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipeData)
    }).then((response) => {
        response.json().then(function (actualData) {
            if ((actualData.status) && actualData.status !== 200) {
                console.log('Something is not right with sign up')
                console.log(actualData.status)
            }
            console.log(actualData)
            location.assign(`/view-recipe.html#${recipeID}`)
        })
    })

})

document.querySelector("#cancel").addEventListener("submit", (e) => {
    e.preventDefault()
    location.assign(`/view-recipe.html#${recipeID}`)
})