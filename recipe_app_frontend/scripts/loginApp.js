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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUserData)
    }).then((response) => {
        if(response.status === 404) {
            alert('Invalid login credientials');
            return;
        }
        response.json().then(function(data1) {
            localStorage.setItem("id", data1["User Info"].data.id)
            localStorage.setItem("token", data1["User Info"].Token)
            if (localStorage.getItem('counter') === null) {
                localStorage.setItem('counter', 0)
            }
            let time = new Date();
            let lastEntered = Math.floor(time.getTime() / 86400000) //Gets the milliseconds and returns it in days rounded down
            const prevLastEntered = localStorage.getItem('lastEntered')
            //Compares the two search times, if the current one is a day later, it will reset the counter to 0
            if (lastEntered > prevLastEntered) {
                counter = 0;
                localStorage.setItem('counter', counter)
            }
            localStorage.setItem('lastEntered', lastEntered)
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