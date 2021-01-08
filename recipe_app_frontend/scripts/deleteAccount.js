document.querySelector('#destroy-button').addEventListener('click', (e) => {
    e.preventDefault()
    var userToken = localStorage.getItem("token")
    fetch("https://recipe-app-jg.herokuapp.com/api/user/delete", {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + userToken,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if(response.status === 404) {
            alert('Updating went wrong');
            return;
        }
        response.json().then(function(data1) {
            console.log(data1)
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            debugger
            location.replace("/index.html")
        })
    }).catch((err) => { 
        alert(err, "Something went wrong, your account has not been deleted")
    })
})

document.querySelector('#cancel-button').addEventListener('click', (e) => {
    e.preventDefault()
    location.assign('/settings.html')
})