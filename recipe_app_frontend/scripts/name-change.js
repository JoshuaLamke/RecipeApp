document.querySelector('#name-change-form').addEventListener('submit', (e) => {
    e.preventDefault()
    var newName = {
        name: ''
    }
    newName.name = e.target[0].value

    var res = newName.name.split(",");
    res = res.filter((ing) => ing.trim().length !== 0)
    if (res) {
        alert('Please enter a new name')
        return
    }
    var userToken = localStorage.getItem("token")
    
    fetch("https://recipe-app-jg.herokuapp.com/api/user/update", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + userToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newName)
    }).then((response) => {
        if(response.status === 404) {
            alert('Updating went wrong');
            return;
        }
        response.json().then(function(data1) {
            console.log(data1)
            debugger
            location.assign(`/user.html`)
        })
    }).catch((err) => { 
        alert(err, " Could not find user with that login information, please try again or sign up to create a new account!")
    })
})

document.querySelector('#cancel-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/settings.html')
})