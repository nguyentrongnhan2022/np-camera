var email = window.localStorage.getItem('email');
if (email != null) document.getElementById("email").value = email;
const form = document.getElementById('login');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const prePayload = new FormData(form);
    const payload = new URLSearchParams(prePayload);

    console.log([...payload])

    fetch("http://127.0.0.1:8000/api/login", {
        method: 'POST',
        body: payload,
    })
        .then(res => res.json())
        .then(data => checkLogin(data))
        .catch(err => console.log(err));
})
function checkLogin(data) {
    if (data.success) {
        console.log(data);
        var token = data.encryptedToken;
        setCookie("encryptedToken", token, 7);
        setCookie("user", JSON.stringify(data.data), 7);
        document.location.href = "http://127.0.0.1:5500/index.html";
    } else {
        document.getElementById("message").innerHTML = "Sai tài khoản hoặc mật khẩu";
    }
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}