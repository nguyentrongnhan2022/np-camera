var urlString = window.location.href;
        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        var id = -1;
const product_view = document.querySelector('.product_view')
function loadProductView(id) {
  fetch('http://127.0.0.1:8000/api/v1/products/' + id, {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'Bearer ' + tokenRealAdmin,
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
    .then(res => { //console.log(res); 
      return res.json() })
    .then(data => {
      base64String=data.data.img;
      console.log(data)
      var kq = ` 
            <div class="col-xl-6 col-lg-6 col-md-12" value="${data.data.id}">
            <form action="" class="tm-edit-product-form" id="meForm">
              <div class="form-group mb-3">
                <label for="name">Tên sản phẩm</label>
                <input id="nameProductAdd" value="${data.data.name}"name="name"type="text"class="form-control validate"required/>
              </div>
              <div class="form-group mb-3">
                <label for="name">Giá</label>
                <input id="priceProductAdd"value="${data.data.price}"type="number"class="form-control validate"required/>
              </div>
              <div class="form-group mb-3">
                <label for="name">Số lượng</label>
                <input id="quantityProductAdd"value="${data.data.quantity}"type="number"class="form-control validate"required/>
              </div>
              <div class="form-group mb-3">
                <label for="description">Mô tả</label>
                <textarea id="descriptionProductAdd"  onkeyup="change(this)" class="form-control validate"rows="3"required>${data.data.description}</textarea>
              </div>
              <div class="form-group mb-3">
                <label for="category">Phân loại</label>
                <select class="custom-select tm-select-accounts"id="categoryproductAdd">
                  <option  >Phân loại</option>
                  <option ${data.data.categories[0].id == 1 ? 'selected' : ''} id="idMayanh" value="1">Máy ảnh</option>
                  <option ${data.data.categories[0].id == 2 ? 'selected' : ''} id="idOngkinh" value="2">Ống kính</option>
                </select>
              </div>
              </form>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-12 mt-4">
            <img src="${data.data.img}" class="tm-product-img-dummy mx-auto"id="imgProductAdd">
            <div class="custom-file mt-3 mb-3 text-center" >
              <input id="chooseImg" type="file" class="mt-1 btn-primary" onchange="imageUploaded()" onclick="document.getElementById('fileInput').click();" required />
            </div>
          </div>
          <div class="col-12">
            <button onclick="handleUpdateInfoPoduct();" type="submit" class="btn btn-primary btn-block text-uppercase">lưu thay đổi</button>
          </div>

    `
      product_view.innerHTML = kq
      product_view.style.height = 'fit-content'
    })
}

function loadProductreview(id) {
  document.location.href = "http://127.0.0.1:5500/Admin/changeProduct.html?id=" + id;
}

let base64String = "";
var chooseImg=false;
//changeproduct
async function handleUpdateInfoPoduct() {
  imageUploaded();
  var nameProductAdd = document.getElementById('nameProductAdd')
  var priceProductAdd = document.getElementById('priceProductAdd')
  var descriptionProductAdd = document.getElementById('descriptionProductAdd')
  var quantityProductAdd = document.getElementById('quantityProductAdd')
  var categoryproductAdd = document.getElementById('categoryproductAdd')
 
  var data = {
  "name": nameProductAdd.value.trim(),
  "description": descriptionProductAdd.value.trim(),
  "percentSale": 5,
  "price": priceProductAdd.value.trim(),
  "img": "data:image/png;base64," + base64String,
  "quantity": quantityProductAdd.value.trim(),
  "status": 1,
  "category": [
      {
          "id": categoryproductAdd.value.trim()
      }
  
  ]
}


console.log(JSON.stringify(data))
var img="";
if(chooseImg){
  img="data:image/png;base64," + base64String
} else {
  img=base64String;
}
  $.ajax({
    
      url: "http://127.0.0.1:8000/api/v1/products/"+id+"/edit",
      beforeSend: function (xhr) {
          /* Authorization header */
          xhr.setRequestHeader("Authorization", 'Bearer ' + tokenRealAdmin);
      },
      type: "PUT",
      dataType: 'JSON',
      data:
      
       {
        "name": nameProductAdd.value.trim(),
        "description": descriptionProductAdd.value.trim(),
        "percentSale": 5,
        "price": priceProductAdd.value.trim(),
        "img": img,
        "quantity": quantityProductAdd.value.trim(),
        "status": 1,
        "category": [
            {
                "id": categoryproductAdd.value.trim()
            }
        
        ]
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

function imageUploaded() {
  var file = document.getElementById('chooseImg')['files'][0];
  if(file != undefined && file!= null)
  {
    chooseImg=true;
    var reader = new FileReader();
    console.log("next");
  
    reader.onload = function () {
      base64String = reader.result.replace("data:", "")
        .replace(/^.+,/, "");
    }
    reader.readAsDataURL(file);
  }
 
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
          // }
          if (id != -1) {
            loadProductView(id)
          }
        }
        loadProductView(id);
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

