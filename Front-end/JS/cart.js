var urlString = window.location.href;
let paramString = urlString.split('?')[1];
let queryString = new URLSearchParams(paramString);
var id = -1;
for (let pair of queryString.entries()) {
  if (pair[0] == "id") {
    id = pair[1];
  }
  // }
  if (id != -1) {
    loadProductView(id)
  }
}
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
  let userData = e.target.value; //user enetered data
  let emptyArray = [];
  if (userData) {
    emptyArray = suggestions.filter((data) => {
      return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      return data = '<li>' + data + '</li>';
    });
    console.log(emptyArray);
    searchWrapper.classList.add("active"); //show autocomplete box
    showSuggestions(emptyArray);
    let allList = suggBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      //adding onlick attribute in all li tag
      allList[i].setAttribute("onclick", "select(this)");
    }
  } else {
    searchWrapper.classList.remove("active"); //hide autocomplete box
  }
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
    listData = '<li>' + userValue + '</li>';
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
          <li><i class="fa-solid fa-right-from-bracket"></i> <a href="login.html">Đăng nhập</a></li>
          <li><i class="fa-solid fa-right-from-bracket"></i> <a href="register.html">Đăng ký</a></li>
          `
    }
    toggleMenuDisplay.innerHTML = htmls();
  }
  else {
    var htmls = function () {
      return `
            <li><i class="fa-solid fa-user"></i> <a href="#">Tài khoản của tôi</a></li>
            <li><i class="fa-solid fa-pen-to-square"></i> <a href="#">Đơn hàng</a></li>
            <li onclick="handleLogout()"><i class="fa-solid fa-right-from-bracket"></i> <a href="#">Đăng xuất</a></li>`

    }
    toggleMenuDisplay.innerHTML = htmls();
  }

  // htmls = $.parseHTML(htmls);


}
function cartToggle() {
  const toggleMenu = document.querySelector('.cart-list');
  toggleMenu.classList.toggle('active')
}

//user
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
      .then(data => { tokenReal = data.token; if (tokenReal) { renderCartView(tokenReal);renderCart(tokenReal) } })
  }
}
getTokenReal()
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

/*Qty*/
// product qty section
function assignButtonAddRemove() {
  let $qty_up = $(".qty .qty-up");
  let $qty_down = $(".qty .qty-down");
  // let $input = $(".qty .qty_input");

  // click on qty up button
  $qty_up.click(function (e) {
    let $input = $(`.qty_input[data-id='${$(this).data("id")}']`);
    if ($input.val() >= 1 && $input.val() <= 9) {
      $input.val(function (i, oldval) {
        return ++oldval;
      });
    handleAdd($(this).data("id"),1)

    }
  });
  // click on qty down button
  $qty_down.click(function (e) {
    let $input = $(`.qty_input[data-id='${$(this).data("id")}']`);
    if ($input.val() > 1 && $input.val() <= 10) {
      $input.val(function (i, oldval) {
        return --oldval;
      });
    }
    handleDelete($(this).data("id"),1)
  });
}

//cart_view
function renderCartView(tokenReal) {
  console.log(tokenReal)
  fetch('http://127.0.0.1:8000/api/user/cart?page=1', {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'Bearer ' + tokenReal,
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
    .then(data => data.json())
    .then(data => {
      console.log(data.data)
      renderCartViewWithArray(data.data)
    })
}
var cartNumbertext = 0
function renderCartViewWithArray(array) {
  console.log("cccc"+ array)
  var parent = document.querySelector(".cart-list");
  var cartNumber = document.querySelector('#cartNumber')
  var cartTittle = `
  <h4 class="text-dark" id="cart_view_tittle" style="font-weight:500; font-size: 16px;">Sản phẩm đã thêm</h4>
  `
  var cartViewProduct = `
  <div style="text-align:center;" id="cart_view_product">
  <a href="cart.html">
      <button class="cart-list_view m-2 text-dark checkout hidden">Xem giỏ hàng</button>
    </a>
  </div>
  `
  var html = "";
  if (array != undefined) {
    cartNumbertext = 0
    html += cartTittle;
    array.forEach(item => {
      cartNumbertext += item.quantity;
      html += ` 
          <ul class="cart-list-item">
              <li class="cart-item">
                  <img src="${item.img}" class="cart-item-img">
                  <div class="cart-item-info" style=" width: 100%; margin-right: 10px;">
                      <div class="cart-item-head"
                          style="display:flex; justify-content: space-between; width: 100%; padding-top: 25px;">
                          <h5 style="font-size:13px;font-weight: 500;">${item.name}</h5>
                          <span id="sum-price" style="font-size: 10px; font-weight: 500;">${changeFormat(item.price)} VNĐ&nbsp;&nbsp; x ${item.quantity}</span>
                      </div>
                      <div class="cart-item-body" style="display: flex; justify-content: space-between;">
                          <span style="font-size: 10px;">Phân loại: ${item.categories[0].name}</span>
                          <span class="cart-item-body_delete" onclick="deleteProduct(${item.id})"
                              style="font-size: 10px; font-weight: 800;">Xóa</span>
                      </div>
                  </div>
              </li>
          </ul>`
    })
    cartNumber.innerHTML = '' + cartNumbertext;
    html += cartViewProduct;
    parent.innerHTML = html;
  }
  else {
    cartNumber.innerHTML = '0';
    parent.innerHTML = `
        <div style="width:240px;">
        <h4 class="text-dark p-2" style="font-weight:500; font-size: 16px; text-align: center;">Sản phẩm đã thêm</h4>
        <img src="images/4076503.png" style=" width: 60%;height: auto; margin: 0 48px;" class="pb-3 pt-3">
        <h3 class="text-dark p-2" style="font-weight:100; font-size:12px;text-align: center;">Giỏ hàng trống</h4>
        </div>
        `
  }
  console.log(parent)
}

//cart
function renderCart(tokenReal) {
  console.log(tokenReal)
  fetch('http://127.0.0.1:8000/api/user/cart?page=1', {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'Bearer ' + tokenReal,
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
    .then(data => data.json())
    .then(data => {
      renderCartWithArray(data.data)
    })
}
var totalNumber_product = 0 
var totalPrice_product = 0
function renderCartWithArray(array) {
  var html = "";
  totalNumber_product = 0 
  totalPrice_product = 0
  array.forEach(item => {  
    totalNumber_product+=item.quantity
    totalPrice_product+=item.price*item.quantity
    html += `
    <div class="row py-3 mt-2" id="${item.id}" data-price=${parseInt(item.price)} data-quantity=${item.quantity} data-total=${parseInt(item.price)*parseInt(item.quantity)}>
                  <div class="col-sm-2">
                      <img src="${item.img}" style=" height:auto;" alt="cart1" class="img-fluid">
                  </div>
                  <div class="col-sm-7">
                      <h5 class="text-dark" style="font-family: var(--sm-font);">${item.name}</h5>
                      <small style="font-size:15px;font-family: var(--sm-font);">${item.categories[0].name}</small>
                      <!-- product rating -->
                      <div class="d-flex mt-2">
                          <div class="rating text-warning" style="font-size:12px;" >
                              <span><i class="fas fa-star"></i></span>
                              <span><i class="fas fa-star"></i></span>
                              <span><i class="fas fa-star"></i></span>
                              <span><i class="fas fa-star"></i></span>
                              <span><i class="fas fa-star"></i></span>
                            </div>
                            <a href="#" class="px-2 text-dark" style="text-decoration:none;">20,534 lượt đánh giá</a>
                      </div>
                      <!--  !product rating-->
                      <!-- product qty -->
                          <div class="qty d-flex pt-3">
                              <div class="d-flex w-25">
                                  <button id="qty__up"class="qty-up border bg-light" data-id="${item.id}" style="border: 0.5px solid rgba(0,0,0,0.05);border-radius:6px 0px 0px 6px;"><i class="fas fa-angle-up"></i></button>
                                  <input type="text" data-id="${item.id}" class="qty_input border px-2 w-100 bg-light" disabled value="${item.quantity}" placeholder="1">
                                  <button id="qty__down"data-id="${item.id}" class="qty-down border bg-light" style="border: 0.5px solid rgba(0,0,0,0.05);border-radius:0px 6px 6px 0px;"><i class="fas fa-angle-down"></i></button>
                              </div>
                              <div>
                                  <button type="submit" class="btn ms-3 delete_product" onclick="deleteProduct(${item.id})" style="font-size:13px;">Xóa</button>
                              </div>
                          </div>
                      <!-- !product qty -->
                  </div>

                  <div class="col-sm-3">
                      <div class="text-dark" style="font-size:14px;">
                          <span class="product_price" >&nbsp;${changeFormat(item.price)} VNĐ</span>
                      </div>
                  </div>
      </div>
    `
  })
  var parent = document.querySelector(".container__cart");
  var totalNumber = document.querySelector("#totalNumber_product")
  var totalPrice = document.querySelector("#totalPrice_product")
  totalNumber.innerHTML=''+totalNumber_product
  totalPrice.innerHTML=''+ changeFormat(totalPrice_product)
  console.log(parent)
  parent.innerHTML = html;
  assignButtonAddRemove();
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
        alert('Xóa sản phẩm thành công !')
        var item = document.getElementById(id)
        totalNumber_product-=parseInt(item.dataset.quantity);
        updateTotal()
        totalPrice_product-=parseInt(item.dataset.total)
          updateTotalPrice()
        item.remove();
      }
      else {
        alert('Xóa sản phẩm không thành công !')
      }
    })
}
function updateTotal(quantity){
  totalNumber_product-=quantity
  var totalNumber = document.querySelector("#totalNumber_product")
  totalNumber.innerHTML=''+totalNumber_product
}
function updateTotal(){
  var totalNumber = document.querySelector("#totalNumber_product")
  totalNumber.innerHTML=''+totalNumber_product
}
function updateTotalDeclineOne(quantity){
  totalNumber_product-=quantity
  var totalNumber = document.querySelector("#totalNumber_product")
  totalNumber.innerHTML=''+totalNumber_product
}
function updateTotalPrice(){
  var totalPrice = document.querySelector("#totalPrice_product")
  totalPrice.innerHTML=''+changeFormat(totalPrice_product)
}

function handleAdd(id,soload) {
  var checkCook = getCookie("encryptedToken");
  if (checkCook == undefined || checkCook == "" || checkCook == "undefined") {
    alert("Bạn chưa đăng nhập !");
    return
  }
  var realToken;
  fetch('http://127.0.0.1:8000/api/retrieveToken', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: checkCook })
  }).then(res => res.json())
    .then(res => {
      $.ajax({
        url: "http://127.0.0.1:8000/api/user/cart/add",
        beforeSend: function (xhr) {
          /* Authorization header */
          xhr.setRequestHeader("Authorization", 'Bearer ' + res.token);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
          "productId": id,
          "quantity": 1
        },

        success: function (data) {
          var item = document.getElementById(id)
          console.log(item);
          totalNumber_product+=1;
          item.dataset.quantity=parseInt(item.dataset.quantity)+1;
          item.dataset.total=parseInt(item.dataset.total)+parseInt(item.dataset.price);
          updateTotal();
          totalPrice_product=parseInt(totalPrice_product)+parseInt(item.dataset.price)
          updateTotalPrice()
          
        },
        error: function (msg) {
          alert(msg);
          console.log(msg);
        }
      });
    });

}
function handleDelete(id){
  var checkCook = getCookie("encryptedToken");
  if (checkCook == undefined || checkCook == "" || checkCook == "undefined") {
    alert("Bạn chưa đăng nhập !");
    return
  }
  var realToken;
  fetch('http://127.0.0.1:8000/api/retrieveToken', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: checkCook })
  }).then(res => res.json())
    .then(res => {
      $.ajax({
        url: "http://127.0.0.1:8000/api/user/cart/reduce/" + id,
        beforeSend: function (xhr) {
          /* Authorization header */
          xhr.setRequestHeader("Authorization", 'Bearer ' + res.token);
        },
        type: "Post",
        dataType: 'JSON',
        data: {
          "productId": id,
          "quantity": 1
        },

        success: function (data) {
          var item = document.getElementById(id)
          console.log(item);
          totalNumber_product-=1;
          item.dataset.quantity=parseInt(item.dataset.quantity)-1;
          item.dataset.total=parseInt(item.dataset.total)-parseInt(item.dataset.price);
          updateTotal();
          totalPrice_product=parseInt(totalPrice_product)-parseInt(item.dataset.price)
          updateTotalPrice()
          
        },
        error: function (msg) {
          alert(msg);
          console.log(msg);
        }
      });
    });

}
function handlePay(){
document.location.href = "checkout.html";
}