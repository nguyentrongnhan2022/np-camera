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
            .then(data => { tokenReal = data.token; if (tokenReal) { checkSuccess(tokenReal) } })
    }
}
getTokenReal()

function checkSuccess(tokenReal) {
    let message = urlParams.get('message');
    let partnerCode = urlParams.get('partnerCode');
    let orderType = urlParams.get('orderType');
    let orderId = urlParams.get('orderId');
    let transId = urlParams.get('transId');
    let payType = urlParams.get('payType');
    let signature = urlParams.get('signature');

    $.ajax({
        url: "http://127.0.0.1:8000/api/user/order/complete/payment",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenReal);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
            "message": message,
            "partnerCode": partnerCode,
            "orderType": orderType,
            "orderId": orderId,
            "transId": transId,
            "payType": payType,
            "signature": signature,
        },

        success: function (data) {},
        error: function (msg) {
            // alert(msg);
            console.log(msg);
        }
    });

    displayOrderState();
}

// Display order state
function displayOrderState() {
    let htmlOutput = '';
    let sign = '';
    let message = urlParams.get('message');

    if (url.includes("Successful.") || url.includes("Giao+d%E1%BB%8Bch+th%C3%A0nh+c%C3%B4ng") || message === null) {
        htmlOutput += `
        <h1 id="state">Đặt hàng thành công !</h1>
        <p class="mt-3 mb-4">Cám ơn quý khách đã tin tưởng và mua hàng ở cửa hàng của chúng tôi.</p>
        <a style="padding:10px;" href="index.html">Về trang chủ</a>`;
        sign = `<div class="check"><i class="fa fa-check" aria-hidden="true"></i></div>`;
    } else {
        htmlOutput += `
        <h1 id="state">Đặt hàng thất bại !</h1>
        <p class="mt-3 mb-4">Đã có lỗi xảy ra trong quá trình đặt hành. Quý khách vui lòng thử lại</p>
        <a style="padding:10px;" href="index.html">Về trang chủ</a>`;
        sign = `<div class="check"><i class="fa fa-close" aria-hidden="true"></i></div>`;
    }

    $(document).ready(function () {
        $(".content").append(htmlOutput).html();
        $(".payment_header").append(sign).html();
    });
    stateOrder.innerHTML = htmlOutput;
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
// var form = document.getElementById("meForm");
var stateOrder = document.getElementsByClassName(".content");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var url = window.location.href;

// form.addEventListener("submit", my_func, true);
