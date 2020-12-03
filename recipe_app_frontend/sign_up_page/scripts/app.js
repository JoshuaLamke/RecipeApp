document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    const firstName = e.target[0].value
    const lastName = e.target[1].value
    const email = e.target[2].value
    const newPassword = e.target[3].value
    const confirmPassword = e.target[4].value
    if(!firstName || !lastName || !email || !newPassword || !confirmPassword) {
        alert('Please fill in all boxes!')
    }
    if (newPassword.length > 7) {
        alert('The password must be at least 8 characters')
    }
    else if (newPassword !== confirmPassword) {
        alert('The password do not match')
    }
})