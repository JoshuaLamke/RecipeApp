document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    const newUserData = {
        email,
        password
    }
    fetch("http://localhost:8081/api/user/login", {
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
                location.assign(`/user.html#${data1.data.id}`)
            }
        })
    })
})

document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    e.preventDefault()
    location.assign('/signUp.html')
})