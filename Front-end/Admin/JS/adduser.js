var firstNameUsertAdd = document.getElementById('firstnameUserAdd');
var lastNameUserAdd = document.getElementById('lastnameUserAdd');
var emailUserAdd = document.getElementById('emailUserAdd');
var passUserAdd = document.getElementById('passUserAdd');

function handleAddUser(){
    meData = JSON.stringify({
            firstName: firstNameUsertAdd.value.trim(),
            lastName: lastNameUserAdd.value.trim(),
            email: emailUserAdd.value.trim(),
            password: passUserAdd.value.trim(),
            subscribed: 0
    });
    console.log(meData);
    $.ajax({
        url: "http://127.0.0.1:8000/api/v1/users/create",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenRealAdmin);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
            "firstName" : firstNameUsertAdd.value.trim(),
            "lastName": lastNameUserAdd.value.trim(),
            "email": emailUserAdd.value.trim(),
            "password": passUserAdd.value.trim(),
            "subscribed": 0
        },
        success: function (data) {
            console.log(data)
            if (data.success == "true" || data.success == true) {
                alert('Thêm khách hàng thành công');
                location.reload()
            }
            else {
                alert('Vui lòng thử lại');
            }
        },
        error: function (msg) {
           
             alert(msg);
          
             console.log(msg);
            console.log(msg.json());
        }
    });
}

var my_func = function (event) {
    event.preventDefault();
    // if (pay_nhanhang.checked) { loadOrder() }
};
var form = document.getElementById("meForm");
form.addEventListener("submit", my_func, true);

//Admin
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
var tokenRealAdmin;
function getTokenRealAdmin() {
    var tokenEncript = getCookie("encryptedTokenAdmin");
    if (tokenEncript != null && tokenEncript != "" && tokenEncript != 'undefined ') {
        fetch('http://127.0.0.1:8000/api/admin/retrieveToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: tokenEncript })
        })
            .then(res => res.json())
            .then(data => {
                tokenRealAdmin = data.token;
                console.log(tokenRealAdmin)
            })
    }
}
getTokenRealAdmin()
function handleLogout() {
    setCookie("encryptedTokenAdmin", '', 0);
    location.reload()
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}