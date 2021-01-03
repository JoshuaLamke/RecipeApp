const userID = localStorage.getItem("id")
const filters = {
    searchText: '',
    sortBy: 'byType'
}
let userData = {
    email: '',
    password: ''
}
let userInfo = {}
fetch('https://recipe-app-jg.herokuapp.com/api/user/' + userID).then((response) => {
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
loadUpUserPage(userID, filters)

document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value
    loadUpUserPage(userID, filters)
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value
    loadUpUserPage(userID, filters)
})

document.querySelector('#create-recipe').addEventListener('click', (e) => {
    
    location.assign("/new-recipe.html")
})

document.querySelector('#log-out').addEventListener('click', (e) => {
    
    localStorage.removeItem("id")
    localStorage.removeItem("token")
    location.replace("/index.html")
})

//Window closed?
// window.addEventListener("beforeunload", (e) => {
//     localStorage.removeItem("id")
//     localStorage.removeItem("token")
// })