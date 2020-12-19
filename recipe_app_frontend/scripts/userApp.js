const userID = localStorage.getItem("id")
const filters = {
    searchText: '',
    sortBy: 'byEdited'
}
loadUpUserPage(userID, filters)

document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value
    loadUpUserPage(userID, filters)
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value
    loadUpUserPage(userID, filters)
})

//Window closed?
document.querySelector('#create-recipe').addEventListener('click', (e) => {
    location.assign("/new-recipe.html")
})

document.querySelector('#log-out').addEventListener('click', (e) => {
    localStorage.removeItem("id")
    localStorage.removeItem("token")
    location.assign("/index.html")
})

// window.addEventListener("beforeunload", (e) => {
//     localStorage.removeItem("id")
//     localStorage.removeItem("token")
// })