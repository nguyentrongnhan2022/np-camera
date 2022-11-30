function loadUser() {
    const user_lists = document.querySelector('.user_list')
    fetch('http://127.0.0.1:8000/api/v1/users', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            var count = 0;
            var itemFilter = data.data.filter((item) => { return item.disabled != 0 && item.disabled != '0' })
            var htmls = itemFilter.map((item) => {
                return `
            <tr id="${item.id}">
                <td>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="${item.id}">
                        <label class="custom-control-label" for="${item.id}">&nbsp;</label>
                    </div>
                </td>
                <td class="table-user">
                    <img src="${item.avatar != null ? item.avatar : item.defaultAvatar}" alt="table-user" class="mr-2 rounded-circle">
                    <a href="javascript:void(0);" class="text-body font-weight-semibold">${item.firstName} ${item.lastName}</a>
                </td>
                <td>
                    ${item.email}
                </td>
                <td>
                    ${item.createdAt}
                </td>
                <td>
                    <span class="badge badge-success-lighten">${item.disabled != null ? 'Blocked' : 'Active'}</span>
                </td>

                <td style="width: 100px;">
                    <a href="#" onclick="loadUserView(${item.id})class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                    <a href="#" onclick="deleteUser(${item.id});" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                </td>
            </tr>`

            })
            user_lists.innerHTML = htmls.join('')
            user_lists.style.height = 'fit-content'
        }
        )
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
                loadUser()
              
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