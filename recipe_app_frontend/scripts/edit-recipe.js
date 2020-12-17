const titleElement = document.querySelector('#title-bar')
const typeElement = document.querySelector('#type-bar')
const servingElement = document.querySelector('#serving-amount-bar')
const ingredientsElement = document.querySelector('#ingredients-bar')
const directionsElement = document.querySelector('#directions-bar')
// let notes = getSavedRecipes()
// let note = notes.find((recipe) => recipe.id === noteID)

//If note is undefined (falsy), then the ! will flip it to true...
// if (!note){
//     location.assign('/index.html')
// }

// titleElement.value = note.title
// bodyElement.value = note.body

// //Set up event listener for the title...
// titleElement.addEventListener('input', (e) => {
//     note.title = e.target.value
//     note.updatedAt = dayjs()
//     note.updatedTimeStamp = dayjs().valueOf()
//     saveNotes(notes)
// })

// //Set up event listener for the body...
// bodyElement.addEventListener('input', (e) => {
//     note.body = e.target.value
//     note.updatedAt = dayjs()
//     note.updatedTimeStamp = dayjs().valueOf()
//     dateElement.textContent = `Last edited on ${dayjs(note.updatedAt).format('MMMM D, YYYY H:m:s')}`
//     saveNotes(notes)
// })

// //Set up event listener for the remove button...
// document.querySelector('#remove-note').addEventListener('click', (e) => {
//     removeNote(note.id)
//     saveNotes(notes)
//     location.assign('/index.html')
// })

// // Will listen in the window in other tabs and notice changes in the other tabs...
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
const recipeData = {
    name: '',
    type: '',
    servingAmount: 0,
    ingredients: {},
    directions: ''
}
// fetch("http://localhost:8081/api/recipe/", {
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