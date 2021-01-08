document.querySelector('#return-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/user.html')
})

document.querySelector('#change-name-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/name-change.html')
})