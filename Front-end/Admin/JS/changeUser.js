var urlString = window.location.href;
        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        // var id = -1;

const user_view = document.querySelector('.user_view')
function loadUserView(id) {
    fetch('http://127.0.0.1:8000/api/v1/users/' + id, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => { //console.log(res); 
            return res.json()
        })
        .then(data => {
            var kq = ` 
      <div class="col-xl-12 col-lg-12 col-md-12">
      <form action="" class="" id="meForm">
        <div class="form-group mb-3">
          <label for="name">Username</label>
          <input id="Username"value="${data.data.firstName} ${data.data.lastName}"placeholder="Nhập username..."type="text"class="form-control validate"required/>
        </div>
        <div class="form-group mb-3">
          <label for="name">Firstname</label>
          <input id="firstNameUser"type="text"value="${data.data.firstName}"placeholder="Nhập firstName..."class="form-control validate"required/>
        </div>
        <div class="form-group mb-3">
          <label for="name">Lastname</label>
          <input id="lastNameUser"type="text"value="${data.data.lastName}"placeholder="Nhập lastName..."class="form-control validate"required/>
        </div>
        <div class="form-group mb-3">
          <label for="description">Email</label>
          <input id="emailUser" type="email"value="${data.data.email}"placeholder="Nhập email..."class="form-control validate"required/>
        </div>
       
        </form>
    </div>
    <div class="col-12">
      <button onclick="handleUpdateInfoUser();" type="submit" class="btn btn-primary btn-block text-uppercase">lưu thay đổi</button>
    </div>
    `
            user_view.innerHTML = kq
            user_view.style.height = 'fit-content'
        })
}

async function handleUpdateInfoUser() {
    var firstNameUser = document.getElementById('firstNameUser')
    var lastNameUser = document.getElementById('lastNameUser')
    var emailUser = document.getElementById('emailUser')
    $.ajax({
      
        url: "http://127.0.0.1:8000/api/v1/users/"+id+"/update",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenRealAdmin);
        },
        type: "PUT",
        dataType: 'JSON',
        data:
        {
            "firstName": firstNameUser.value.trim(),
            "lastName": lastNameUser.value.trim(),
            "email": emailUser.value.trim()
        },
  
        success: function (data) {
            console.log(data)
            if (data.success == "true" || data.success == true) {
                alert('Cập nhật thành công');
                document.location.reload();
  
            }
            else {
                alert('Vui lòng thử lại');
            }
        },
        error: function (msg) {
            alert(msg);
            console.log(msg);
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

                for (let pair of queryString.entries()) {
                    if (pair[0] == "id") {
                        id = pair[1];
                    }
                    console.log(id)
                    // }
                    if (id != -1) {
                        loadUserView(id)
                    }
                }
                //loadUserView(id);
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

