function deleteProduct(id) {
    fetch('http://127.0.0.1:8000/api/v1/users/'+id+'/disable=1' , {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(data => data.json())
        .then(data => {
            console.log(data)
            if (data.success == 'true' || data.success == true) {
                
                alert('Xóa khách hàng thành công !')
                var item = document.getElementById(id)
                item.remove();
            }
            else {
                alert('Xóa khách hàng không thành công !')
            }
        })
}

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