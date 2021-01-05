const id = location.hash
const userID = id.split("#").pop()
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

document.querySelector('#new-recipe').addEventListener('submit', (e) => {
    e.preventDefault()
    recipeData.title = e.target[0].value
    recipeData.type = e.target[1].value
    recipeData.servingAmount = e.target[2].value
    console.log(recipeData.servingAmount)
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

//Set up event listener for the remove button...
// document.querySelector('#remove-note').addEventListener('click', (e) => {
//     removeNote(note.id)
//     saveNotes(notes)
//     location.assign('/index.html')
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
// fetch("https://recipe-app-jg.herokuapp.com/api/recipe/", {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(recipeData)
//     }).then((response) => {
//         response.json().then(function (actualData) {
//             if ((actualData.status) && actualData.status !== 200) {
//                 console.log('Something is not right with sign up')
//                 console.log(actualData.status)
//             }
//             console.log(actualData)
            
//         })
//     })