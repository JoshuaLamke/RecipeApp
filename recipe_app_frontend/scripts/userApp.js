const id = location.hash
const userID = id.split("#").pop()
loadUpUserPage(userID)
document.querySelector('#create-recipe').addEventListener('click', (e) => {
    location.assign("/edit-recipe.html")
})