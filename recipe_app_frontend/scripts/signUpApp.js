fetch('http://localhost:8081/api/users').then((response) => {
         response.json().then((data) => {
             console.log(data)
         })
})
document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    const firstName = e.target[0].value
    const lastName = e.target[1].value
    const email = e.target[2].value
    const newPassword = e.target[3].value
    const confirmPassword = e.target[4].value
    if(!firstName || !lastName || !email || !newPassword || !confirmPassword) {
        alert('Please fill in all boxes!')
    }
    if (newPassword.length <= 7) {
        alert('The password must be at least 8 characters')
    }
    else if (newPassword !== confirmPassword) {
        alert('The password do not match')
    }
    const userData = {
        name: firstName + ' ' + lastName,
        email,
        password: newPassword
    }
    fetch("http://localhost:8081/api/user/signup", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    }).then((response) => {
        response.json().then(function (actualData) {
            if ((actualData.status) && actualData.status !== 200) {
                console.log('Something is not right with sign up')
                console.log(actualData.status)
            }
            console.log(actualData)
        })
    })
    const newUserData = {
        email,
        password: newPassword
    }
    fetch("http://localhost:8081/api/user/login", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newUserData)
    }).then((response) => {
        response.json().then(function (data1) {
            if ((data1.status) && data1.status !== 200) {
                console.log('Something is not right with login')
            }
            localStorage.setItem("id", data1.data.id)
            localStorage.setItem("token", JSON.stringify(data1.Token))
            location.assign(`/user.html`)
        })
    })
})