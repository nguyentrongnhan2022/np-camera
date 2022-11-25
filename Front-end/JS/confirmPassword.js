
var emailCheck=getCookie("emailCheck")
const email=document.getElementById('email');
email.value=emailCheck
const form = document.getElementById('checkconfirmPassword');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const prePayload = new FormData(form);
    const payload = new URLSearchParams(prePayload);

    console.log([...payload])

    fetch("http://127.0.0.1:8000/api/resetPassword", {
        method: 'POST',
        body: payload,
    })
        .then(res => res.json())
        .then(data => checkPass(data))
        // .catch(err => console.log(err));
})
function checkPass(data) {
    console.log(data);    
    if (data.success) {
        console.log(data);       
        document.location.href = "http://127.0.0.1:5500/login.html";
    } else {
        document.getElementById("message").innerHTML = "Mật khẩu không khớp";
    }
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }