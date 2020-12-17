const loadUpUserPage = (email, password) => {
    const userData = {
        email: 'gerardoabaunza@icloud.com',
        password: 'Lidgerval101'
    }
    let userInfo = {}
    fetch('http://localhost:8081/api/user/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    }).then((response) => {
        response.json().then(function (actualResponse) {//There will be the actual response which has a message, data, and a token...
            console.log(actualResponse) 
            console.log(actualResponse.data)
            userInfo = actualResponse.data
            let welcomeMessage = document.createElement('p')
            let greeting = 'Welcome ' + userInfo.name + '!'
            welcomeMessage.textContent = greeting
            document.querySelector('#personal').appendChild(welcomeMessage)
        })
    })
}