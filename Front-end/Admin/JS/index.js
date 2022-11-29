//dashboard 
function loadDashboard() {
    
    fetch('http://127.0.0.1:8000/api/admin/dashboard', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            const dashboard_lists = document.querySelector('.dashboard_list')
            var htmls = `
        <div class="col-lg-6 col-xl-6 ">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <h3 class="text-muted font-weight-normal mt-0 text-truncate" title="Campaign Sent">Sản phẩm</h3>
                                <h3 class="my-2 py-1">${data.totalProducts}</h3>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    <div id="campaign-sent-chart" data-colors="#536de6"></div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div> 
                </div>
            <div class="col-lg-6 col-xl-6">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <h3 class="text-muted font-weight-normal mt-0 text-truncate" title="New Leads">Doanh thu</h3>
                                <h3 class="my-2 py-1">${changeFormat(data.totalSales)} VNĐ</h3>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    <div id="new-leads-chart" data-colors="#10c469"></div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div> 
            </div> 
            <div class="col-lg-6 col-xl-6">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <h3 class="text-muted font-weight-normal mt-0 text-truncate" title="Deals">Đơn hàng</h3>
                                <h3 class="my-2 py-1">${data.recentOrders}</h3>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    <div id="deals-chart" data-colors="#536de6"></div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div> 
            </div> 

            <div class="col-lg-6 col-xl-6">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <h3 class="text-muted font-weight-normal mt-0 text-truncate" title="Booked Revenue">Đơn hàng đang xử lí</h3>
                                <h3 class="my-2 py-1">${data.totalOrdersPending}</h3>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    <div id="booked-revenue-chart" data-colors="#10c469"></div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div> 
            </div> 
            `
            dashboard_lists.innerHTML = htmls
            dashboard_lists.style.height = 'fit-content'
        })
}

//product admin
function loadProduct() {
    const product_lists = document.querySelector('.product_list')
    fetch('http://127.0.0.1:8000/api/v1/products', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            var htmls = "";
            //var itemFilter = data.data.filter(item => item.deletedAt != 1)
            console.log(data)
            for (const index in data) {
                var item = data[index];
                console.log(data)
                htmls += `
        <tr id="${item.id}">
            <td>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" >
                    <label class="custom-control-label" for="${item.id}">&nbsp;</label>
                </div>
            </td>
            <td>
                <img src="${item.img}" alt="contact-img" title="contact-img" class="rounded mr-3" height="48" />
                <p class="m-0 d-inline-block align-middle font-16">
                <a href="#" class="text-body">${item.name}</a>
            <br/>
                <span class="text-warning mdi mdi-star"></span>
                <span class="text-warning mdi mdi-star"></span>
                <span class="text-warning mdi mdi-star"></span>
                <span class="text-warning mdi mdi-star"></span>
                <span class="text-warning mdi mdi-star"></span>
            </p>
            </td>
            <td>
                ${item.categories[0].name}
            </td>
        <td>
            ${item.createdAt}
        </td>
        <td>
             ${changeFormat(item.price)} VNĐ
        </td>
                        
        <td>
            ${item.quantity}
        </td>
        <td>
            <span class="badge badge-success">Active</span>
        </td>
                        
        <td class="table-action">
            <a href="#" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
            <a href="#"onclick="deleteProduct(${item.id});"  class="action-icon"><i class="mdi mdi-delete"></i></a>
        </td>
    </tr>`
            }
            product_lists.innerHTML = htmls
            product_lists.style.height = 'fit-content'
        })
}
function changeFormat(price) {
    var numFloat = parseFloat(price);
    let number3 = numFloat.toLocaleString('vi-VN');
    return number3;
}
//user admin
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
                    <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                    <a href="#" onclick="deleteProduct(${item.id});" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                </td>
            </tr>`

            })
            user_lists.innerHTML = htmls.join('')
            user_lists.style.height = 'fit-content'
        }
        )
}

//order admin
function loadOrder() {
    const order_lists = document.querySelector('.order_list')
    fetch('http://127.0.0.1:8000/api/v1/orders?page=1', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(res => res.json())
        .then(data => {
            var count = 0;
            var htmls = data.data.map((item) => {
                return `
                <tr>
                <td>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input"
                            id="customCheck2">
                        <label class="custom-control-label"
                            for="customCheck2">&nbsp;</label>
                    </div>
                </td>
                <td><a href="apps-ecommerce-orders-details.html"
                        class="text-body font-weight-bold">${item.orderId}</a> </td>
                <td>
                    ${item.createdAt}
                </td>
                <td>
                    <h5><span class="badge badge-success-lighten"><i
                                class="mdi mdi-coin"></i>Đã thanh toán</span></h5>
                </td>
                <td>
                    ${changeFormat(item.price)} VNĐ
                </td>
                <td>
                    TTKNH
                </td>
                <td class="text-center">
                    <button class="btn-primary ${(item.status == 2 && item.deletedBy == null) ? 'nutmautoi' : ''}" style="border:none;${item.deletedBy == null ? 'display:block;' : 'display:none;'} cursor:pointer;" id=${item.orderId + 'ok'} onclick="xacNhanCmm(${item.orderId},'ok')">Xác nhận</button>
                    <button class="btn-primary ${(item.status == 0 && item.deletedBy != null) ? 'nutmautoi' : ''}" style="border:none; ${((item.deletedBy == null&&item.status!=2)||(item.deletedBy!=null&&item.status==0))? 'display:block;' : 'display:none;'} cursor:pointer;"id=${item.orderId + 'notok'} onclick="xacNhanCmm(${item.orderId},'notok')" ">Xử lý sau</button>
                </td>
                <td>
                    <a href="#" class="action-icon"> <i
                            class="mdi mdi-square-edit-outline"></i></a>
                    <a href="#" class="action-icon"> <i
                            class="mdi mdi-delete"></i></a>
                </td>
            </tr>`

            })
            order_lists.innerHTML = htmls.join('')
            order_lists.style.height = 'fit-content'
        }
        )
}
function xacNhanCmm(id, str) {
    console.log(id)
    console.log(str)
    var caithbicut;
    var caiDendi;
    if (str == 'ok') {
        console.log("str ok")
        caithbicut = document.getElementById(id + 'notok');
        caiDendi = document.getElementById(id + str);
        console.log(caithbicut)
        console.log(caiDendi)
        xacnhacDonHang(2,id);
    } else {
        console.log("str notok")
        caithbicut = document.getElementById(id + 'ok');
        caiDendi = document.getElementById(id + str);
        console.log(caithbicut)
        console.log(caiDendi)
        //xacnhacDonHang(2);
        huyDonHangCmm(id);
    }
    caithbicut.remove();
    caiDendi.disabled = true
    caiDendi.classList.add('nutmautoi')

}
function xacnhacDonHang(status,id) {
    fetch('http://127.0.0.1:8000/api/v1/orders/' + id + '/update/status=' + status, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(data => {

        })
}
function huyDonHangCmm(id) {
    console.log('huyDonHangCmm' + id)
    fetch('http://127.0.0.1:8000/api/v1/orders/' + id + '/destroy=1', {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenRealAdmin,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(data => {
            console.log("huyDonHangCmm receive")
        })
}
//
function loadAdCate() {
    const toggleMenuList = document.querySelector('.menu_list');
    //   console.log(toggleMenuList);
    const toggleMenuDisplay = document.querySelector('.menu_list ul');
    //   toggleMenuList.classList.toggle('active')
    var token = 'encryptedTokenAdmin'

    var checkCook = getCookie(token);
    if (checkCook == null || checkCook == "" || checkCook == ' undefined') {
        var htmls = function () {
            return `
        <li class="side-nav-item">
        <a href="index.html" class="side-nav-link">
            <i class="uil-home-alt"></i>
            <span> Trang Chủ </span>
        </a>
    </li>

    <li class="side-nav-title side-nav-item">Website</li>

    <li class="side-nav-item">
    <a href="" class="side-nav-link">
        <i class="uil-store"></i>
        <span> Cửa Hàng </span>
    </a>
    <ul class="side-nav-second-level" aria-expanded="false">
        <li>
            <a href="apps-ecommerce-products.html">Sản phẩm</a>
        </li>
        <li>
            <a href="apps-ecommerce-orders.html">Đơn Hàng</a>
        </li>
        <li>
            <a href="apps-ecommerce-customers.html">Khách Hàng</a>
        </li>
    </ul>
    </li>
    <li class="side-nav-item">
        <a href="#" onclick="location.href='AdminLogin.html'" class="side-nav-link">
            <i class="mdi mdi-logout mr-1"></i>
            <span> Đăng Nhập </span>
        </a>
    </li>`

        }
        toggleMenuList.innerHTML = htmls();
        console.log(toggleMenuList);
    }
    else {
        var htmls = function () {
            return `
        <li class="side-nav-item">
        <a href="index.html" class="side-nav-link">
            <i class="uil-home-alt"></i>
            <span> Trang Chủ </span>
        </a>
    </li>

    <li class="side-nav-title side-nav-item">Website</li>

    <li class="side-nav-item">
        <a href="javascript: void(0);" class="side-nav-link">
            <i class="uil-store"></i>
            <span> Cửa Hàng </span>
            <span class="menu-arrow"></span>
        </a>
        <ul class="side-nav-second-level" aria-expanded="false">
        <li>
        <a href="apps-ecommerce-products.html">Sản Phẩm</a>
    </li>
    <li>
        <a href="apps-ecommerce-orders.html">Đơn Hàng</a>
    </li>
    <li>
        <a href="apps-ecommerce-customers.html">Khách Hàng</a>
    </li>
        </ul>
    </li>
    <li class="side-nav-item">
        <a href ="#"onclick="handleLogout()" class="side-nav-link">
            <i class="mdi mdi-logout mr-1"></i>
            <span onclick="handleLogout()"> Đăng Xuất </span>
        </a>
    </li>`
        }
        toggleMenuList.innerHTML = htmls();
    }
}
loadAdCate()


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
                loadDashboard()
                loadProduct()
                loadUser()
                loadOrder()
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

