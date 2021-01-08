document.querySelector('#return-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/user.html')
})

document.querySelector('#delete-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/deleteAccount.html')
})

document.querySelector('#change-name-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/name-change.html')
})