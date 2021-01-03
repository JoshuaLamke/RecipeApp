document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    const newUserData = {
        email,
        password
    }
    // "http://localhost:8080/api/user/login"
    fetch("https://recipe-app-jg.herokuapp.com/api/user/login", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newUserData)
    }).then((response) => {
        response.json().then(function (data1) {
            if (data1.error) {
                alert("Could not find user with that login information, please try again or sign up to create a new account!")
            }
            else if ((data1.status) && data1.status !== 200) {
                console.log('Something is not right with login')
            }
            else {
                console.log(data1["User info"])
                localStorage.setItem("id", data1["User info"].data.id)
                localStorage.setItem("token", data1["User info"].Token)
                location.assign(`/user.html`)
            }
        }).catch((err) => { 
            alert("Could not find user with that login information, please try again or sign up to create a new account!")
        })
    })
})

document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    e.preventDefault()
    location.assign('./signUp.html')
})