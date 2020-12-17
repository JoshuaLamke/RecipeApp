document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    //get id based on login info with fetch!
    const email = e.target[0].value
    const password = e.target[1].value
    console.log(email)
    debugger
    location.assign(`/user.html#${email}`)
    console.log(email)
})