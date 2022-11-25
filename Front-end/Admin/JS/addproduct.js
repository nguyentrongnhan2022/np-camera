var nameProductAdd = document.getElementById('nameProductAdd');
var descriptionProductAdd = document.getElementById('descriptionProductAdd');
var pricePorductAdd = document.getElementById('priceProductAdd');
var idMayanh = document.getElementById('idMayanh')
var idOngkinh = document.getElementById('idOngkinh')

var sltCategory=document.getElementById('category')
let base64String = "";
function imageUploaded() {
    var file = document.getElementById('chooseImg')['files'][0];
  
    var reader = new FileReader();
    console.log("next");
      
    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
    }
    reader.readAsDataURL(file);
}
  
function handleAddProduct(id) {
    //check frontend 10kitu cua mota 
    imageUploaded();
    meData = JSON.stringify({
        name : nameProductAdd.value.trim(),
        description: descriptionProductAdd.value.trim(),
        price: pricePorductAdd.value.trim(),
        percentSale: 0,
        img: "data:image/png;base64," + base64String,
        quantity: 1,
        category: [
            {
                "id": sltCategory.value
            }
        ]
    });
    console.log(meData);
    $.ajax({
        url: "http://127.0.0.1:8000/api/v1/products/add",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", 'Bearer ' + tokenRealAdmin);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
            "name" : nameProductAdd.value.trim(),
            "description": descriptionProductAdd.value.trim(),
            "price": pricePorductAdd.value.trim(),
            "percentSale": 0,
            "img": "data:image/png;base64," + base64String,
            "quantity": 1,
            "category": [
                {
                    "id": sltCategory.value
                }
            ]
        },
        success: function (data) {
            if (data.success == "true" || data.success == true) {
                alert('Thêm sản phẩm thành công');
                location.reload()
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

