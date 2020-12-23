const loadUpUserPage = (userID, filters) => {
    recipeList = []

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
            renderRecipes(recipeList, filters)
        })
    })
    renderRecipes(recipeList, filters)
}

const generateSmallRecipeDOM = (recipe) => {
    const recipeElement = document.createElement('div')
    const titleElement = document.createElement('a')
    const textElement = document.createAttribute('p')
    // const viewElement = document.createElement('button')

    titleElement.innerText = recipe.name
    // titleElement.classList.add('list-item__title')
    // titleElement.appendChild(textElement)
    titleElement.setAttribute('href', `/view-recipe.html#${recipe.id}`)
    recipeElement.appendChild(titleElement)
    recipeElement.setAttribute("id", "item")

    // Set up the view button
    // viewElement.addEventListener('click', (e) => {
    //     location.assign(`/../view-recipe.html#${recipe.id}`)
    // })
    // viewElement.classList.add('list-item')
    // recipeElement.appendChild(viewElement)
    return recipeElement
}

const renderRecipes = (recipeList, filters) => {
    const recipesElement = document.querySelector('div#recipeList')
    recipeList = sortRecipes(recipeList, filters.sortBy)
    const filteredRecipes = recipeList.filter((recipe) => recipe.name.toLowerCase().includes(filters.searchText.toLowerCase()))
    //Not sure what the bottom does tbh...
    recipesElement.innerHTML = '<p></p>'

    if (filteredRecipes.length > 0){
        filteredRecipes.forEach((recipe) => {
            const recipeElement = generateSmallRecipeDOM(recipe)
            recipesElement.appendChild(recipeElement)
        })
    }
    else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'You currently have no recipes. Try creating one!'
        emptyMessage.classList.add('empty-message')
        recipesElement.appendChild(emptyMessage)
    }
}

const sortRecipes = (recipeList, sortBy) => {
    if (sortBy === 'alphabetical'){
        return recipeList.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()){
                return -1
            }
            else if (a.name.toLowerCase() > b.name.toLowerCase()){
                return 1
            }
            else {
                return 0
            }
        })
    }
    else{
        return recipeList
    }
}

const createRecipe = (userID, recipeData) => {
    let fetchRecipeData = {
        name: recipeData.title,
        type: recipeData.type,
        servingAmount: recipeData.servingAmount,
        ingredients: recipeData.ingredients,
        directions: recipeData.directions
    }
    var userToken = localStorage.getItem("token")
    var userid = localStorage.getItem("id")
    fetch("http://localhost:8081/api/recipe/", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fetchRecipeData)
    }).then((response) => {
        response.json().then(function (actualData) {
            if ((actualData.status) && actualData.status !== 200) {
                console.log('Something is not right with sign up')
                console.log(actualData.status)
            }
            console.log(actualData);
            location.assign('/user.html');
        })
    })
}