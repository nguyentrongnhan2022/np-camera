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
function handleLogout() {
    setCookie("encryptedToken", '', 0);
    location.reload()
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}
function changeFormat(price) {
    var numFloat = parseFloat(price);
    let number3 = numFloat.toLocaleString('vi-VN');
    return number3;
}
var tokenReal;
function getTokenReal() {
    var tokenEncript = getCookie("encryptedToken");
    if (tokenEncript != null && tokenEncript != "" && tokenEncript != 'undefined ') {
        fetch('http://127.0.0.1:8000/api/retrieveToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: tokenEncript })
        })
            .then(res => res.json())
            .then(data => { tokenReal = data.token; loadOrderHistory(), loadProfileUser() })
    }
}
getTokenReal()


const orders_list = document.querySelector('.order_list')
function loadOrderHistory() {
    fetch('http://127.0.0.1:8000/api/user/order/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenReal,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            var htmls = "";
            for (var index = 0; index < data.data.length; index++) {
                var item = data.data[index];
                htmls += `
        <li class="mb-5" style="list-style:none;">
        <h5 id="idOrder"style="font-size:13px;font-weight:500; color:black;">ID :&nbsp; ${item.idDelivery}</h5>
        <h5 id="idDate" style="font-size:13px;font-weight:500; color:black;">Ngày đặt hàng :&nbsp;${item.dateOrder} </h5>
        <h5 id="idName"style="font-size:13px;font-weight:500; color:black;">Tên :&nbsp;${item.nameReceiver}</h5>
        <h5  id="idAdr"style="font-size:13px;font-weight:500; color:black;">Địa chỉ : &nbsp;${item.address}</h5>
        <h5 id="idSDT"style="font-size:13px;font-weight:500; color:black;">Số điện thoại : &nbsp;${item.phoneReceiver}</h5>
        <h5 id="idPrice"style="font-size:13px;font-weight:500; color:black;">Tổng tiền :&nbsp;${changeFormat(item.totalPrice)} VNĐ</h5>
        <h5 id="idStatus"style="font-size:13px;font-weight:500; color:black;">Trạng thái đơn hàng :&nbsp;${item.status == 2 ? "ĐƠN HÀNG ĐÃ ĐƯỢC XÁC THỰC." : "ĐƠN HÀNG ĐANG ĐƯỢC XỬ LÝ."} </h5>
        </li>`
            }

            orders_list.innerHTML = htmls
            orders_list.style.height = 'fit-content'
        })
}
loadOrderHistory();

//proflie
const profile_user = document.querySelector('.profile_user')
function loadProfileUser() {
    fetch('http://127.0.0.1:8000/api/user/profile', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenReal,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            var kq = ` 
    <div class="row">
        <div class="col-md-12">
            <div class="mb-3">
                <label class="small mb-1" style="font-weight:600 ;"
                    for="inputUsername">Username</label>
                <input class="form-control" id="inputUsername" type="text" value="${data.data.firstName} ${data.data.lastName}"placeholder="Nhập username..." style="font-weight:400;font-size: 15px;">
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-3">
                <label class="small mb-1" style="font-weight:600 ;" for="inputFirstName">First
                    name</label>
                <input class="form-control" id="inputFirstName" type="text" value="${data.data.firstName}"placeholder="Nhập first name..." style="font-weight:400;font-size: 15px;">
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-3">
                <label class="small mb-1" style="font-weight:600 ;" for="inputLastName">Last
                    name</label>
                <input class="form-control" id="inputLastName" type="text" value="${data.data.lastName}"placeholder="Nhập last name..." style="font-weight:400;font-size: 15px;">
            </div>
        </div>
        <div class="col-md-12">
            <div class="mb-3">
                <label class="small mb-1" style="font-weight:600 ;"for="inputEmailAddress">Email</label>
                <input class="form-control" id="inputEmailAddress" type="email" value="${data.data.email}"placeholder="Nhập email..." style="font-weight:400;font-size: 15px;">
            </div>
        </div>
    </div>
    <div>
        <button class="btn btn-primary mt-2" onclick="handleUpdateInfo()" type="button" style="font-size: 15px;">Lưu thay đổi</button>
    </div>

    `
            profile_user.innerHTML = kq
            profile_user.style.height = 'fit-content'
        })
}
loadProfileUser();

async function handleUpdateInfo() {
    var inputFirstName = document.getElementById('inputFirstName')
    var inputLastName = document.getElementById('inputLastName')
    var inputEmailAddress = document.getElementById('inputEmailAddress')
    $.ajax({
        url: "http://127.0.0.1:8000/api/user/update",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenReal);
        },
        type: "PUT",
        dataType: 'JSON',
        data: {
            "firstName": inputFirstName.value.trim(),
            "lastName": inputLastName.value.trim(),
            "email": inputEmailAddress.value.trim(),
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


async function handleUpdatePassword() {
    var inputOldPassword = document.getElementById('inputOldPassword')
    var inputNewPassword = document.getElementById('inputNewPassword')
    var inputConfirmNewPassword = document.getElementById('inputConfirmNewPassword')
    $.ajax({
        url: "http://127.0.0.1:8000/api/user/changePassword",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenReal);
        },
        type: "PUT",
        dataType: 'JSON',
        data: {
            "oldPassword": inputOldPassword.value.trim(),
            "password": inputNewPassword.value.trim(),
            "confirmPassword": inputConfirmNewPassword.value.trim(),
        },

        success: function (data) {
            var message = document.getElementById("message");
            var message1 = document.getElementById("message1");
            if (data.success == false) {
                //dk del th cong
                if (data.errors == "Mật khẩu cũ không chính xác.") {
                    //trung email
                    message.innerHTML = "Mật khẩu không chính xác";
                } else {
                    //pass kh trung
                    message1.innerHTML = "Nhập lại mật khẩu không khớp";
                }
            }
            else {
                alert('Cập nhật mật khẩu thành công');
                document.location.reload();
            }
        },
        error: function (msg) {
            alert(msg);
            console.log(msg);
        }
    });
}


function backHome(){
    window.location.href("index.html")
}



