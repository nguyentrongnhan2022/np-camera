// init Isotope
var collection_prices;
var $grid = $('.collection-list').isotope({
    // options
});
// filter items on button click
$('.filter-button-group').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    resetfilterBtns();
    $(this).addClass('active-filter-btn');
    $grid.isotope({ filter: filterValue });
});

var filterBtns = $('.filter-button-group').find('button');
function resetfilterBtns() {
    filterBtns.each(function () {
        $(this).removeClass('active-filter-btn');
    });
}
//Getting all required element //search
const searchWrapper = document.querySelector(".search_input");
const inputBox = searchWrapper.querySelector("#input_search");
const suggBox = searchWrapper.querySelector(".autocom-box");

//if user press any key and release
inputBox.onkeyup = (e) => {
    const regex = /[`~!@#$%^&*()-_+{}[\]\\|,.//?;':"]/g
    let userData = e.target.value; //user enetered data
    userData = userData.replace(regex, '')
    if (userData.length == 0) {
        suggBox.innerHTML = "";
        return;
    }
    userData = userData.toLocaleLowerCase();
    let emptyArray = [];
    if (userData) {
        // emptyArray = suggestions.filter((data) => {
        //   return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        // });
        //query lsit form key search

        $.ajax({
            url: "http://127.0.0.1:8000/api/products/filter/search=" + userData,
            type: "GET",
            success: function (data) {
                // renderCartView(tokenReal)
                // alert('Thêm sản phẩm thành công');
                console.log("key" + userData);
                console.log(data);
                if (data.data) {
                    var arrayData = data.data.filter((data) => { return data.deletedAt != 1 });
                    console.log("arrayData");
                    console.log(arrayData);
                    emptyArray = arrayData.map((data) => {
                        return data = `<li onclick="gotoProduct(${data.id})" id="${data.id}" style="color:black;"> ${data.name} </li>`;
                    });
                    console.log(emptyArray);
                    searchWrapper.classList.add("active"); //show autocomplete box
                    showSuggestions(emptyArray);
                    // let allList = suggBox.querySelectorAll("li");
                    // for (let i = 0; i < allList.length; i++) {
                    //   //adding onlick attribute in all li tag
                    //   allList[i].setAttribute("onclick", "select(this)");
                    // }
                }
                else {
                    suggBox.innerHTML = "<li>Không có kết quả phù hợp</li>";
                }

            },
            error: function (msg) {
                alert(msg);
                console.log(msg);
            }
        });
    } else {
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function gotoProduct(id) {
    document.location.href = "http://127.0.0.1:5500/product.html?id=" + id;
}
function select(element) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData // passing the user selected list item data in textfield 
    searchWrapper.classList.remove("active"); //hide autocomplete box
}
function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = '<li style="color:black;">' + userValue + '</li>';
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}
function searchToggle() {
    const toggleSearch = document.querySelector('.wrapper');
    toggleSearch.classList.toggle('active')
}
function menuToggle() {
    const toggleMenu = document.querySelector('.action_menu');
    const toggleMenuDisplay = document.querySelector('.action_menu ul');
    console.log(toggleMenuDisplay)
    toggleMenu.classList.toggle('active')
    var token = 'encryptedToken'

    var checkCook = getCookie(token);
    if (checkCook == null || checkCook == "" || checkCook == ' undefined') {
        var htmls = function () {
            return `
          <li><i class="fa-solid fa-right-from-bracket"></i> <a href="login.html" style="color:black;">Đăng nhập</a></li>
          <li><i class="fa-solid fa-right-from-bracket"></i> <a href="register.html" style="color:black;">Đăng ký</a></li>
          `
        }
        toggleMenuDisplay.innerHTML = htmls();
    }
    else {
        var htmls = function () {
            return `
            <li><i class="fa-solid fa-user" style="color:black;"></i> <a href="UserSetting.html">Tài khoản của tôi</a></li>
            <li onclick="handleLogout()"><i class="fa-solid fa-right-from-bracket" style="color:black;"></i> <a href="#">Đăng xuất</a></li>`

        }
        toggleMenuDisplay.innerHTML = htmls();
    }

    // htmls = $.parseHTML(htmls);

}
function cartToggle() {
    const toggleMenu = document.querySelector('.cart-list');
    toggleMenu.classList.toggle('active')
}

// user
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
            .then(data => { tokenReal = data.token; if (tokenReal) { loadCartCheckout(tokenReal) } })
    }
}
getTokenReal()

//add to cart
function loadCartCheckout(tokenReal) {
    console.log(tokenReal)
    fetch('http://127.0.0.1:8000/api/user/cart/state=all', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenReal,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(data => data.json())
        .then(data => {
            console.log(data.data)
            renderCartCheckout(data)
        })
}
var totalPrice = document.querySelector("#totalPrice_product")
var totalNumber = document.querySelector("#totalNumber_product")

var totalNumber_product = 0
var totalPrice_product = 0
function renderCartCheckout(array) {
    totalPrice_product = 0
    totalNumber_product = 0
    var parent = document.querySelector(".checkout_list");
    var cartTittleCheck = `
    <h4>Giỏ hàng <span class="price" style="color:black"><i class="fa fa-shopping-cart"></i></span></h4>
    `
    var cartCheckoutPay = `
    <hr>
    <p class="price text-dark" style="font-weight:600;">Tổng tiền <span class="price text-dark"><span id="totalPrice_product"></span></span></p>
    `
    var html = "";
    if (array != undefined) {
        html += cartTittleCheck;
        array.forEach(item => {
            totalNumber_product += item.quantity
            totalPrice_product += item.price * item.quantity
            var price = changeFormat(parseInt(item.price) * parseInt(item.quantity));
            html += ` 
            <p class="mt-3"><a href="#" class="text-dark" style="text-decoration:none;">${item.name}</a> 
            <span style="color:red;"id="totalNumber_product">&nbsp;&nbsp;x${item.quantity}</span>
            <span class="price">${price} VNĐ</span></p>`
        })
        html += cartCheckoutPay;
        parent.innerHTML = html;
        var totalPrice = document.querySelector("#totalPrice_product")
        totalPrice.innerHTML = '' + changeFormat(totalPrice_product) + '&nbsp;VNĐ'
    }
    else {

    }

    console.log(parent)
}
function deleteProduct(id) {
    fetch('http://127.0.0.1:8000/api/user/cart/destroy/' + id, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenReal,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
        .then(data => data.json())
        .then(data => {
            if (data.success == 'true' || data.success == true) {
                renderCartView(tokenReal)
                alert('Xóa sản phẩm thành công !')
                var item = document.getElementById(id)
                item.remove();
            }
            else {
                alert('Xóa sản phẩm không thành công !')
            }
        })
}

var todayDate = new Date();
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var H = today.getHours();
var i = today.getMinutes();
var s = today.getSeconds();

//today = yyyy + '-' + mm + '-' + dd+' '+H+':'+i+':'+s;


var nameUser = document.getElementById('nameUser');
var address = document.getElementById('adrUser');
var phoneNumber = document.getElementById('phoneNumber');
console.log(address)

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}
var today = todayDate.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: "h24" });

// Place order function
async function loadOrder(paidType) {
    // If price is above 50 millions, check if paid type is momo then procceed to stop customer from make place order
    if (parseInt(paidType) === 1 || parseInt(paidType) === 2) {
        if (totalPrice_product > 50000000) {
            alert("Momo chỉ cho phép thanh toán đơn hàng dưới 50,000,000 VNĐ. Quý khách vui lòng chọn hình thức thanh toán khác");
            return;
        }
    }

    meData = JSON.stringify({
        voucherCode: "",
        dateOrder: today,
        address: address.value.trim(),
        nameReceiver: nameUser.value.trim(),
        phoneReceiver: phoneNumber.value.trim(),
        paidType: parseInt(paidType)
    });
    console.log(paidType);
    // today = pad(todayDate.getFullYear()) + '-' + pad(todayDate.getMonth() + 1) + '-' + pad(todayDate.getDate()) + '- ' + pad(todayDate.getHours()) + ':' + pad(todayDate.getMinutes()) + ':' + pad(todayDate.getSeconds())
    // console.log("today" + today)
    // console.log(today)

    console.log(today)
    var todayArr = today.split(',')
    var newToday = todayArr[0].trim() + ' ' + todayArr[1].trim()
    console.log(newToday)

    $.ajax({
        url: "http://127.0.0.1:8000/api/user/order/placeorder",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenReal);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
            "voucherCode": "",
            "dateOrder": newToday,
            "address": address.value.trim(),
            "nameReceiver": nameUser.value.trim(),
            "phoneReceiver": phoneNumber.value.trim(),
            "paidType": parseInt(paidType)
        },

        success: function (data) {
            if (data.success == "true" || data.success == true) {
                if (parseInt(paidType) !== 0) {
                    console.log( data.link.payUr)
                    window.location.href = data.link.payUrl;
                }
                alert('Thanh toán thành công');
                document.location.href = "paySucces.html";
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
    if (pay_nhanhang.checked) {
        loadOrder(pay_nhanhang.value);
        // document.location.href = "paySucces.html";
    } else if (pay_nhanhang_momo_atm.checked) {
        loadOrder(pay_nhanhang_momo_atm.value);
    } else {
        loadOrder(pay_nhanhang_momo_qr.value);
    }
};
var form = document.getElementById("meForm");
form.addEventListener("submit", my_func, true);
var pay_nhanhang = document.getElementById('pay_nhanhang')
var pay_nhanhang_momo_atm = document.getElementById('pay_momo_atm')
var totalPrice_product = document.getElementById('totalPrice_product')
var pay_nhanhang_momo_qr = document.getElementById('pay_momo_qr')
