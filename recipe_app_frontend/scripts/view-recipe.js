const titleElement = document.querySelector('#recipe-name')
const typeElement = document.querySelector('#recipe-type')
const servingsElement = document.querySelector('#recipe-servings')
const ingredientsElement = document.querySelector('#recipe-ingredients')
const directionsElement = document.querySelector('#recipe-directions')
const recipeID = location.hash.substring(1)

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
        // In case for some reason we can't find the recipe, it will return the user to the previous page
        if (!wantedRecipe){
            location.assign('/user.html')
            alert("Sorry! Looks like there was a mistake")
        }
        titleElement.textContent = wantedRecipe.name
        typeElement.textContent = "Type: " + wantedRecipe.type
        servingsElement.textContent = "Servings: " + wantedRecipe.servingamount
        var str = wantedRecipe.ingredients
        var res = str.split(",");
        res = res.filter((ing) => ing.trim().length !== 0)
        let count = 0;
        res.forEach((element) => {
            count++
            let newElement = document.createElement('li')
            newElement.textContent = element
            ingredientsElement.appendChild(newElement)
        });
        let strDir = wantedRecipe.directions
        let resDir = strDir.split(".");
        resDir = resDir.filter((dir) => dir.trim().length !== 0)
        const resDirLength = resDir.length;
        let countDir = 0;
        resDir.forEach((element) => {
            if (countDir === resDirLength-1) {
                const length = element.length
                var newString = element.substring(0, length-1)
                if (element[length - 1] == ".") {
                    let newElement = document.createElement('li')
                    newElement.textContent = newString
                    directionsElement.appendChild(newElement)
                    countDir++
                    return
                }
                else {
                    let newElement = document.createElement('li')
                    newElement.textContent = element
                    directionsElement.appendChild(newElement)
                    countDir++
                    return
                }
                
            }
            let newElement = document.createElement('li')
            newElement.textContent = element
            directionsElement.appendChild(newElement)
            countDir++
        });
    })
})

//If the user clicks the delete button it will delete the recipe
document.querySelector('#recipe-delete').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch("https://recipe-app-jg.herokuapp.com/api/recipe/" + recipeID, {
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

document.querySelector('#recipe-return').addEventListener("submit", (e) => {
    e.preventDefault()
    location.assign('/user.html')
})