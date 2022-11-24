const form = document.getElementById('register');
var hehe;
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const prePayload = new FormData(form);
    const payload = new URLSearchParams(prePayload);
    hehe = [...payload][2][1];
    console.log([...payload])

    fetch("http://127.0.0.1:8000/api/register", {
        method: 'POST',
        body: payload,
    })
        .then(res => res.json())
        .then(data => handelData(data))
        .catch(err => console.log(err));


})
function handelData(data) {
    var message = document.getElementById("message");
    if (data.success == false) {
        //dk del th cong
        if (data.errors == "Email already exists") {
            //trung email
            message.innerHTML = "Email đã được sử dụng";
        } else {
            //pass kh trung
            message.innerHTML = "Nhập lại mật khẩu không khớp";
        }
    }
    else {
        message.innerHTML = "";
        window.localStorage.setItem('email', hehe);
        document.location = "http://127.0.0.1:5500/login.html";
        alert("alo");
    }
}