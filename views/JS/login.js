async function getUserDetail(event) {
    event.preventDefault();
    // document.getElementById('container').style.transform = "translate(-5px, -10px)";
    let email = document.getElementById('email-ip').value;
    let password = document.getElementById('password-ip').value;

    const userDetails = {
        email: email,
        password: password
    }

    try {
        const response = await axios.post('http://localhost:3000/log-in', userDetails);
        if (response.status === 200) {
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
            document.getElementById('error-heading').textContent = "Login Sucsessfully";


        }
    } catch (error) {
        // Handle error response
        if (error.response && error.response.status === 404) {
            document.getElementById('error-heading').textContent = "Email or Password doesn't match";
            document.getElementById('email-ip').value = "";
            document.getElementById('password-ip').value = "";
        } else {
            console.log('Error:', error.message);
        }
    }
}