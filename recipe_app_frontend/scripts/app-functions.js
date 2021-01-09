//Will load the user page including the recipes that the user has
const loadUpUserPage = (userID, filters) => {
    recipeList = []

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
            renderRecipes(recipeList, filters)
        })
    })
    renderRecipes(recipeList, filters)
}

//Will create the DOM for the recipe that is passed in
const generateSmallRecipeDOM = (recipe) => {
    const recipeElement = document.createElement('div')
    const titleElement = document.createElement('a')
    const textElement = document.createAttribute('p')
    // const viewElement = document.createElement('button')

    titleElement.innerText = recipe.name
    // titleElement.classList.add('list-item__title')
    // titleElement.appendChild(textElement)
    titleElement.setAttribute('href', `/view-recipe.html#${recipe.id}`)
    titleElement.style.fontSize = "125%";
    recipeElement.appendChild(titleElement)
    recipeElement.setAttribute("id", "item")
    recipeElement.classList.add('recipeItem')

    // Set up the view button
    // viewElement.addEventListener('click', (e) => {
    //     location.assign(`/../view-recipe.html#${recipe.id}`)
    // })
    // viewElement.classList.add('list-item')
    // recipeElement.appendChild(viewElement)
    return recipeElement
}

//Depending on the filters, the search text, and the recipes the user has, it will display in the user page
const renderRecipes = (recipeList, filters) => {
    const recipesElement = document.querySelector('div#recipeList')

    //Will go through each type and create a div for it
    const breakfastGroup = document.createElement('div')
    breakfastGroup.className = 'd-flex flex-column align-items-center'
    breakfastGroup.setAttribute('id', 'breakfastType')
    breakfastGroup.classList.add('typeLabel')

    const lunchGroup = document.createElement('div')
    lunchGroup.className = 'd-flex flex-column align-items-center'
    lunchGroup.setAttribute('id', 'lunchType')
    lunchGroup.classList.add('typeLabel')

    const dinnerGroup = document.createElement('div')
    dinnerGroup.className = 'd-flex flex-column align-items-center'
    dinnerGroup.setAttribute('id', 'dinnerType')
    dinnerGroup.classList.add('typeLabel')

    const dessertGroup = document.createElement('div')
    dessertGroup.className = 'd-flex flex-column align-items-center'
    dessertGroup.setAttribute('id', 'dessertType')
    dessertGroup.classList.add('typeLabel')

    const snackGroup = document.createElement('div')
    snackGroup.className = 'd-flex flex-column align-items-center'
    snackGroup.setAttribute('id', 'snackType')
    snackGroup.classList.add('typeLabel')

    const otherGroup = document.createElement('div')
    otherGroup.className = 'd-flex flex-column align-items-center'
    otherGroup.setAttribute('id', 'otherType')
    otherGroup.classList.add('typeLabel')

    //Creating and adding the labels to their respective div groups
    const bLabel = document.createElement('label')
    bLabel.setAttribute('for', 'breakfastGroup')
    bLabel.textContent = 'Breakfast Recipes'
    bLabel.style.fontSize = "150%";
    bLabel.style.textDecoration = "underline"
    breakfastGroup.appendChild(bLabel)

    const lLabel = document.createElement('label')
    lLabel.setAttribute('for', 'lunchGroup')
    lLabel.textContent = 'Lunch Recipes'
    lLabel.style.fontSize = "150%";
    lLabel.style.textDecoration = "underline"
    lunchGroup.appendChild(lLabel)

    const dLabel = document.createElement('label')
    dLabel.setAttribute('for', 'dinnerGroup')
    dLabel.textContent = 'Dinner Recipes'
    dLabel.style.fontSize = "150%";
    dLabel.style.textDecoration = "underline"
    dinnerGroup.appendChild(dLabel)

    const deLabel = document.createElement('label')
    deLabel.setAttribute('for', 'dessertGroup')
    deLabel.textContent = 'Dessert Recipes'
    deLabel.style.fontSize = "150%";
    deLabel.style.textDecoration = "underline"
    dessertGroup.appendChild(deLabel)

    const sLabel = document.createElement('label')
    sLabel.setAttribute('for', 'snackGroup')
    sLabel.textContent = 'Snack Recipes'
    sLabel.style.fontSize = "150%";
    sLabel.style.textDecoration = "underline"
    snackGroup.appendChild(sLabel)

    const oLabel = document.createElement('label')
    oLabel.setAttribute('for', 'otherGroup')
    oLabel.textContent = 'Other Recipes'
    oLabel.style.fontSize = "150%";
    oLabel.style.textDecoration = "underline"
    otherGroup.appendChild(oLabel)

    recipeList = sortRecipes(recipeList, filters.sortBy)
    const filteredRecipes = recipeList.filter((recipe) => recipe.name.toLowerCase().includes(filters.searchText.toLowerCase()))

    recipesElement.innerHTML = '<p></p>'

    //These counters will serve a purpose if sorting by type, which is the default
    var breakfastCounter = 0
    var lunchCounter = 0
    var dinnerCounter = 0
    var dessertCounter = 0
    var snackCounter = 0
    var otherCounter = 0
    if (filteredRecipes.length > 0){
        filteredRecipes.forEach((recipe) => {
            const recipeElement = generateSmallRecipeDOM(recipe)
            //If sorting by type then it will keep track of the countersand add the types into the list
            if (filters.sortBy === 'byType') {
                if (recipe.type.toLowerCase() === 'breakfast') {
                    breakfastCounter++
                    breakfastGroup.appendChild(recipeElement)
                }
                else if (recipe.type.toLowerCase() === 'lunch') {
                    lunchCounter++
                    lunchGroup.appendChild(recipeElement)
                }
                else if (recipe.type.toLowerCase() === 'dinner') {
                    dinnerCounter++
                    dinnerGroup.appendChild(recipeElement)
                }
                else if (recipe.type.toLowerCase() === 'dessert') {
                    dessertCounter++
                    dessertGroup.appendChild(recipeElement)
                }
                else if (recipe.type.toLowerCase() === 'snack') {
                    snackCounter++
                    snackGroup.appendChild(recipeElement)
                }
                else {
                    otherCounter++
                    otherGroup.appendChild(recipeElement)
                }
            }
            //If not sorting by type then it will ignore the ocunters and just list the recipes however they are sorted
            else {
                recipesElement.appendChild(recipeElement)
            }
        })
        //If sorting by type, then before finalizing it will look at which groups have no recipes to display and add a small message
        if (filters.sortBy === 'byType') {
            if (breakfastCounter === 0) {
                const noBMessage = document.createElement('p')
                noBMessage.textContent = 'No breakfast recipes'
                noBMessage.classList.add('none-message')
                noBMessage.style.fontSize = "125%";
                breakfastGroup.appendChild(noBMessage)
            }
            if (lunchCounter === 0) {
                const noLMessage = document.createElement('p')
                noLMessage.textContent = 'No lunch recipes'
                noLMessage.classList.add('none-message')
                noLMessage.style.fontSize = "125%";
                lunchGroup.appendChild(noLMessage)
            }
            if (dinnerCounter === 0) {
                const noDMessage = document.createElement('p')
                noDMessage.textContent = 'No dinner recipes'
                noDMessage.classList.add('none-message')
                noDMessage.style.fontSize = "125%";
                dinnerGroup.appendChild(noDMessage)
            }
            if (dessertCounter === 0) {
                const noDEMessage = document.createElement('p')
                noDEMessage.textContent = 'No dessert recipes'
                noDEMessage.classList.add('none-message')
                noDEMessage.style.fontSize = "125%";
                dessertGroup.appendChild(noDEMessage)
            }
            if (snackCounter === 0) {
                const noSMessage = document.createElement('p')
                noSMessage.textContent = 'No snack recipes'
                noSMessage.classList.add('none-message')
                noSMessage.style.fontSize = "125%";
                snackGroup.appendChild(noSMessage)
            }
            if (otherCounter === 0) {
                const noOMessage = document.createElement('p')
                noOMessage.textContent = 'No other recipes'
                noOMessage.classList.add('none-message')
                noOMessage.style.fontSize = "125%";
                otherGroup.appendChild(noOMessage)
            }
            
            //This will occus if there as at least one type that has at least one recipe
            if (breakfastCounter !== 0 || lunchCounter !== 0 || dinnerCounter !== 0 || dessertCounter !== 0 || snackCounter !== 0 || otherCounter !== 0) {
                //Adding all the type groups here, remember that this will only occur if sorting by type
                
                recipesElement.appendChild(breakfastGroup)
                
                recipesElement.appendChild(lunchGroup)
                
                recipesElement.appendChild(dinnerGroup)
                
                recipesElement.appendChild(dessertGroup)
                
                recipesElement.appendChild(snackGroup)
                
                recipesElement.appendChild(otherGroup)
            }
            //If every type group is empty it will just display the regular no recipes message
            else {
                const emptyMessage = document.createElement('p')
                emptyMessage.textContent = 'You currently have no recipes. Try creating one!'
                emptyMessage.classList.add('empty-message')
                recipesElement.appendChild(emptyMessage)
            }
        }
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
    else if (sortBy === 'byCreated') {
        return recipeList.sort((a, b) => {
            if (a.id < b.id) {
                return 1
            }
            else if (a.id > b.id) {
                return -1
            }
            else {
                return 0
            }
        })
    }
    //If sorting by type it will sort alphabetically within each type group
    else if (sortBy === 'byType') {
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

//Creates a new recipe, saves it into the databse using fetch, and reloads the user page with the new recipe added
const createRecipe = (userID, recipeData, img) => {
    let fetchRecipeData = {
        name: recipeData.title,
        type: recipeData.type,
        servingAmount: recipeData.servingAmount,
        ingredients: recipeData.ingredients,
        directions: recipeData.directions,
        img: ''
    }
    var userToken = localStorage.getItem("token")
    var userid = localStorage.getItem("id")
    if(img.value) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            fetchRecipeData.img = reader.result
            console.log(fetchRecipeData.img)
        })
        reader.readAsDataURL(img.files[0])
    }
    fetch("https://recipe-app-jg.herokuapp.com/api/recipe/", {
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
            //location.assign('/user.html');
        })
    }).catch((err) => {
        console.log(err)
    })
}