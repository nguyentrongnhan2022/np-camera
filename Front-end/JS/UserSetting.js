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
            .then(data => { tokenReal = data.token;  loadOrderHistory()})
    }
}
getTokenReal()

// const profile_user = document.querySelector('.profie')
// console.log(profile_user)
// function loadProfile() {
//     fetch('http://127.0.0.1:8000/api/user/profile', {
//         method: 'GET',
//         headers: new Headers({
//             'Authorization': 'Bearer ' + tokenReal,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         })
//     })
//         .then(res => res.json())
//         .then(data => {
//                 return `
//         <div class="col-md-12">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;"
//                 for="inputUsername">Username</label>
//             <input class="form-control" id="inputUsername" type="text"
//                 placeholder="${data.data.lastName}+${data.data.firstName}" style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
//     <div class="col-md-6">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;" for="inputFirstName">First
//                 name</label>
//             <input class="form-control" id="inputFirstName" type="text"
//                 placeholder="${data.data.firstName}" style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
//     <div class="col-md-6">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;" for="inputLastName">Last
//                 name</label>
//             <input class="form-control" id="inputLastName" type="text"
//                 placeholder="${data.data.lastName}" style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
//     <div class="col-md-12">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;"
//                 for="inputEmailAddress">Email</label>
//             <input class="form-control" id="inputEmailAddress" type="email"
//                 placeholder="${data.data.email}" style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
//     <div class="col-md-6">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;" for="inputPhone">Số điện
//                 thoại</label>
//             <input class="form-control" id="inputPhone" type="tel"
//                 placeholder="Nhập số điện thoại..." style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
//     <div class="col-md-6">
//         <div class="mb-3">
//             <label class="small mb-1" style="font-weight:600 ;" for="inputBirthday">Ngày
//                 sinh</label>
//             <input class="form-control" id="inputBirthday" type="text" name="birthday"
//                 placeholder="Nhập ngày sinh..." style="font-weight:300;font-size: 15px;">
//         </div>
//     </div>
// </div>`
//             })
//             profile_user.innerHTML = htmls.join('')
//             profile_user.style.height = 'fit-content'
//         }
// loadProfile();

// function handleUpload(){
// }

const idOrder = document.getElementById('idOrder')
const idName = document.getElementById('idName')
const idAdr = document.getElementById('idAdr')
const idSDT = document.getElementById('idSDT')
const idPrice = document.getElementById('idPrice')
const idStatus = document.getElementById('idStatus')

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var H = today.getHours();
var i = today.getMinutes();
var s = today.getSeconds();

//today = yyyy + '-' + mm + '-' + dd+' '+H+':'+i+':'+s;
//today=pad(since.getDate())+'.'+pad(since.getMonth()+1)+'. '+ pad(since.getHours())+':'+pad(since.getMinutes())\
today = "2022-10-15 18:15:20"
//document.write(today);
console.log(today)

// async function historyOrder(){
//         meData = JSON.stringify({
//             id: idOrder.value.trim(),
//             dateOrder: today,
//             address: idAdr.value.trim(),
//             nameReceiver: idName.value.trim(),
//             phoneReceiver: "0372963918",
//             totalPrice: idPrice.value.trim(),
//         });
//         console.log(meData);
//         $.ajax({
//             url: "http://127.0.0.1:8000/api/user/order/",
//             beforeSend: function (xhr) {
//                 /* Authorization header */
//                 xhr.setRequestHeader("Authorization", 'Bearer ' + tokenReal);
//             },
//             type: "Get",
//             dataType: 'JSON',
//             data: {
//                 "id": 1,
//                 "customerId": idOrder.value.trim(),
//                 "dateOrder": today,
//                 "address": idAdr.value.trim(),
//                 "nameReceiver": idName.value.trim(),
//                 "phoneReceiver": "0372963918",
//                 "totalPrice": idPrice.value.trim(),
//             },
//         });
//     }

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
      var htmls="";
      console.log("data"+data)
      for(var index=0; index< data.data.length;index++ ){
        var item=data.data[index];
        console.log("item"+item)
        htmls+=`
        <li class="mb-5" style="list-style:none;">
        <h5 id="idOrder"style="font-size:13px;font-weight:500; color:black;">ID :&nbsp; ${item.idDelivery}</h5>
        <h5 id="idDate" style="font-size:13px;font-weight:500; color:black;">Ngày đặt hàng :&nbsp;${item.dateOrder} </h5>
        <h5 id="idName"style="font-size:13px;font-weight:500; color:black;">Tên :&nbsp;${item.nameReceiver}</h5>
        <h5  id="idAdr"style="font-size:13px;font-weight:500; color:black;">Địa chỉ : &nbsp;${item.address}</h5>
        <h5 id="idSDT"style="font-size:13px;font-weight:500; color:black;">Số điện thoại : &nbsp;${item.phoneReceiver}</h5>
        <h5 id="idPrice"style="font-size:13px;font-weight:500; color:black;">Tổng tiền :&nbsp;${changeFormat(item.totalPrice)} VNĐ</h5>
        <h5 id="idStatus"style="font-size:13px;font-weight:500; color:black;">Trạng thái đơn hàng :&nbsp;${item.status==2?"ĐƠN HÀNG ĐÃ ĐƯỢC XÁC THỰC.":"ĐƠN HÀNG ĐANG ĐƯỢC XỬ LÝ."} </h5>
        </li>`
      }
      
      orders_list.innerHTML = htmls
      orders_list.style.height = 'fit-content'
      })
    }
loadOrderHistory();
   

