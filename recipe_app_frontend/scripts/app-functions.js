const loadUpUserPage = (userID, filters) => {
    const userData = {
        email: '',
        password: ''
    }
    recipeList = []
    let userInfo = {}
    fetch('http://localhost:8081/api/user/' + userID).then((response) => {
        response.json().then(function (actualResponse) {
            if ((actualResponse.status) && actualResponse.status !== 200) {
                console.log('Something is not right')
                console.log(actualResponse.status)
            }
            userData.email = actualResponse.data.email
            userData.password = actualResponse.data.password
            userInfo = actualResponse.data
            let welcomeMessage = document.createElement('h2')
            let greeting = 'Welcome ' + userInfo.name + '!'
            welcomeMessage.textContent = greeting
            document.querySelector('#greeting').appendChild(welcomeMessage)
        })
    })

    // fetch('http://localhost:8081/api/recipes', {
    //     method: 'GET',
    //     headers: {
    //         "Authorization": "Bearer" + jwt.sign(userToken,),
    //         "Content-Type": "application/json"
    //     }
    // }).then((response) => {
    //     response.json().then(function (actualResponse) {
    //         if ((actualResponse.status) && actualResponse.status !== 200) {
    //             console.log('Something is not right')
    //             console.log(actualResponse.status)
    //         }
    //         recipeList = actualResponse.data
    //         renderRecipes(recipeList, filters)
    //     })
    // })
    recipeList = []
    renderRecipes(recipeList, filters)
}

const generateSmallRecipeDOM = (recipe) => {
    const recipeElement = document.createElement('div')
    const titleElement = document.createElement('p')
    const viewElement = document.createElement('button')

    titleElement.textContent = recipe.title
    // titleElement.classList.add('list-item__title')
    recipeElement.appendChild(titleElement)

    // Set up the view button
    viewElement.addEventListeer('click', `/view-recipe.html#${recipe.id}`)
    // viewElement.classList.add('list-item')

    return recipeElement
}

const renderRecipes = (recipeList, filters) => {
    const recipesElement = document.querySelector('div#recipeList')
    debugger
    recipeList = sortRecipes(recipeList, filters.sortBy)
    const filteredRecipes = recipeList.filter((recipe) => recipe.title.toLowerCase().includes(filters.searchText.toLowerCase()))
    
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
            if (a.title.toLowerCase() < b.title.toLowerCase()){
                return -1
            }
            else if (a.title.toLowerCase() > b.title.toLowerCase()){
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
        title: recipeData.title,
        type: recipeData.type,
        servingAmount: recipeData.servingAmount,
        ingredients: recipeData.ingredients,
        directions: recipeData.directions
    }
    var userToken = localStorage.getItem("token")
    userToken = JSON.stringify(userToken)
    fetch("http://localhost:8081/api/recipe/", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer" + jwt.sign(userToken,),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fetchRecipeData)
    }).then((response) => {
        response.json().then(function (actualData) {
            if ((actualData.status) && actualData.status !== 200) {
                console.log('Something is not right with sign up')
                console.log(actualData.status)
            }
            console.log(actualData)
        })
    })
}