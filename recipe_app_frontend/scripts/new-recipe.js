const id = location.hash
const GERARDO_API_KEY = 'fc13712a478843d7b347575dcc0e04c3'
const JOSHUA_API_KEY = 'bfd57da057f541eeb8feba2547fc5e39'
let API_KEY = ''
const userID = id.split("#").pop()
let typeBoolean = false;
let counter = localStorage.getItem('counter')
counter = parseInt(counter, 10);

let recipeData = {
    title: '',
    type: '',
    servingAmount: '',
    ingredients: '',
    directions: ''
}
const titleElement = document.querySelector('#title-bar')
const typeElement = document.querySelector('#type-bar')
const servingElement = document.querySelector('#serving-amount-bar')
const ingredientsElement = document.querySelector('#ingredients-bar')
const directionsElement = document.querySelector('#directions-bar')
const searchBar = document.querySelector('#search-recipe-bar')
const addRecipeButton = document.createElement('button')
addRecipeButton.textContent = 'Add Recipe'

document.getElementById('search-recipe-button').addEventListener('click', (e) => {
    e.preventDefault()
    counter += 1
    localStorage.setItem('counter', counter)
    let search = searchBar.value
    if(search.trim === '') {
        alert('Type in the name of a recipe')
        return
    }
    if (counter%2 === 0) {
        API_KEY = JOSHUA_API_KEY;
    }
    else {
        API_KEY = GERARDO_API_KEY;
    }
    console.log(API_KEY)
    debugger
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${search}&instructionsRequired=true&addRecipeInformation=true&number=10&apiKey=${API_KEY}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if(response.status === 402) {
            alert('No more searches for today! Sorry!')
            return;
        }
        else if(response.status !== 200) {
            alert('something went wrong')
            return
        }
        else {
            response.json().then((data) => {
                console.log(data.results)
                for(let i = 0; i < data.results.length; i++) {
                    let button = document.createElement('button')
                    button.className = 'btn btn-primary'
                    button.textContent = 'Add Recipe'
                    button.id = `add-recipe-button-${i+1}`
                    button.style = 'margin-left: 5px'
                    button.addEventListener('click', (e) => {
                        e.preventDefault()
                        let recipeNum = e.target.id.split('-')[3]
                        let directions = ''
                        let ingredients = ''
                        recipeData.title = data.results[recipeNum-1].title
                        if (data.results[recipeNum-1].dishTypes.length != 0) {
                            data.results[recipeNum-1].dishTypes.forEach((type) => {
                                if (type.toLowerCase() === 'breakfast') {
                                    recipeData.type = 'Breakfast'
                                    typeBoolean = true;
                                }
                                else if (type.toLowerCase() === 'lunch') {
                                    recipeData.type = 'Lunch'
                                    typeBoolean = true;
                                }
                                else if (type.toLowerCase() === 'dinner') {
                                    recipeData.type = 'Dinner'
                                    typeBoolean = true;
                                }
                                else if (type.toLowerCase() === 'dessert') {
                                    recipeData.type = 'Dessert'
                                    typeBoolean = true;
                                }
                                else if (type.toLowerCase() === 'snack') {
                                    recipeData.type = 'Snack'
                                    typeBoolean = true;
                                }
                                else {
                                    recipeData.type = 'Other'
                                }
                            })
                        }
                        else {
                            recipeData.type = 'Other'
                        }
                        for(let i = 0; i < data.results[recipeNum-1].analyzedInstructions[0].steps.length; i++) {
                            directions = directions + data.results[recipeNum-1].analyzedInstructions[0].steps[i].step
                            for(let j = 0; j < data.results[recipeNum-1].analyzedInstructions[0].steps[i].ingredients.length; j++){
                                ingredients = ingredients + data.results[recipeNum-1].analyzedInstructions[0].steps[i].ingredients[j].name + ','
                            }
                        }
                        recipeData.directions = directions
                        let set = new Set(ingredients.split(','))
                        ingredients = Array.from(set).join(',')
                        recipeData.ingredients = ingredients
                        recipeData.servingAmount = data.results[recipeNum-1].servings
                        let userID = localStorage.getItem("id")
                        createRecipe(userID, recipeData)
                    })
                    document.getElementById(`recipe-${i+1}`).textContent = data.results[i].title
                    document.getElementById(`recipe-${i+1}`).appendChild(button)
                }
            })
        }
    })
})

document.querySelector('#new-recipe').addEventListener('submit', (e) => {
    e.preventDefault()
    recipeData.title = e.target[0].value
    recipeData.type = e.target[1].value
    recipeData.servingAmount = e.target[2].value
    recipeData.ingredients = e.target[3].value 
    recipeData.directions = e.target[4].value

    
    if(!recipeData.title ||
        !recipeData.type ||
        !recipeData.servingAmount ||
        !recipeData.ingredients ||
        !recipeData.directions) {
            alert('Please fill out all recipe fields!');
            return;
        }
    let userID = localStorage.getItem("id")
    createRecipe(userID, recipeData)

})

document.querySelector("#cancel").addEventListener("submit", (e) => {
    e.preventDefault()
    location.assign('/user.html')
})

//Set up event listener for the body...
// bodyElement.addEventListener('input', (e) => {
//     note.body = e.target.value
//     note.updatedAt = dayjs()
//     note.updatedTimeStamp = dayjs().valueOf()
//     dateElement.textContent = `Last edited on ${dayjs(note.updatedAt).format('MMMM D, YYYY H:m:s')}`
//     saveNotes(notes)
// })

// Will listen in the window in other tabs and notice changes in the other tabs...
// window.addEventListener('storage', (e) => {
//     if (e.key === 'notes'){
//         notes = JSON.parse(e.newValue)
//         let note = notes.find((note) => note.id === noteID)
        
//         if (!note){
//             location.assign('/index.html')
//         }

//         titleElement.value = note.title
//         bodyElement.value = note.body
//         dateElement.textContent = `Last edited on ${dayjs(note.updatedAt).format('MMMM D, YYYY H:m:s')}`
//     }
// })