// var email = window.localStorage.getItem('email');
// if (email != null) document.getElementById("email").value = email;
const form = document.getElementById('forgetpassword');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const prePayload = new FormData(form);
    const payload = new URLSearchParams(prePayload);
    const emailCkeck = document.getElementById('email')
    console.log([...payload])
    setCookie("emailCheck",emailCkeck.value,7)
    fetch("http://127.0.0.1:8000/api/forgotPassword", {
        method: 'POST',
        body: payload,
    })
        .then(res => res.json())
        .then(data => checkEmail(data))
        
        // .catch(err => console.log(err));
})
function checkEmail(data) {
    if (data.success) {
        console.log(data);
        var token = data.encryptedToken;
        setCookie("encryptedToken", token, 7);
        setCookie("user", JSON.stringify(data.data), 7);
        document.location.href = "http://127.0.0.1:5500/checkCode.html";
    } else {
        document.getElementById("message").innerHTML = "Email chưa được đăng kí";
    }
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}