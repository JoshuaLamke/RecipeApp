document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    const newUserData = {
        email,
        password
    }
    fetch("https://recipe-app-jg.herokuapp.com/api/user/login", {
        method: 'POST',
        body: JSON.stringify(newUserData)
    }).then((response) => {
        response.json().then(function(data1) {
            localStorage.setItem("id", data1["User Info"].data.id)
            localStorage.setItem("token", data1["User Info"].Token)
            location.assign(`/user.html`)
        })
    }).catch((err) => { 
        alert(err, " Could not find user with that login information, please try again or sign up to create a new account!")
    })
})

document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    e.preventDefault()
    location.assign('./signUp.html')
})