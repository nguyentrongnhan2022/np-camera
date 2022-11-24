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
      .then(data => { tokenReal = data.token; if (tokenReal) { renderCartView(tokenReal) } })
  }
}
getTokenReal()

//product
const page_links = document.querySelectorAll('.page-link')
var page_link_1 = page_links[0];
var page_link_2 = page_links[1];
page_link_1.classList.add('active');
var current_page_link = 1;
page_link_1.onclick = () => { handlePart(1); page_link_1.classList.add('active'); page_link_2.classList.remove('active'); };
page_link_2.onclick = () => { handlePart(2); page_link_2.classList.add('active'); page_link_1.classList.remove('active'); };

function loadProduct() {
  allItems = [];
  const collection_lists = document.querySelector('.collection-list')
  fetch('http://127.0.0.1:8000/api/products')
    .then(res => res.json())
    .then(data => {
      var htmls = data.data.map((item) => {
        var kq = ` 
        <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
        <a href="product.html?id=${item.id}"" style="text-decoration:none;" class=" text-dark">
              <div class="collection-img">
                  <img src="${item.img}" class="collection-img_img">
              </div>
              <div class="text-center">
                <div class="rating mt-3">
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                </div>
              <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
              <span class=" fw-bold d-block"style="font-size:15px;"> ${changeFormat(item.price)} VNĐ</span>
              </a>
              <button class="btn btn-primary mt-3 addToCart" data-product-id="1" onclick="handleAdd(${item.id});"  style="font-size:15px;">Thêm vào giỏ hàng</button>
            </div>
        </div>`
        var price = parseInt(item.price);
        allItems.push({ "price": price, "html": kq });
        return kq;
      })
      collection_lists.innerHTML = htmls.join('')
      collection_lists.style.height = 'fit-content'
    }

    )
}
loadProduct()
function handlePart(index) {
  if (current_page_link == index) return;
  current_page_link = index;
  const collection_lists = document.querySelector('.collection-list')
  fetch(`http://127.0.0.1:8000/api/products?page=${index}`)
    .then(res => res.json())
    .then(data => {
      var htmls = data.data.map((item) => {
        return ` 
        <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3" >
              <a href="product.html?id=${item.id}"" style="text-decoration:none;" class=" text-dark">
              <div class="collection-img">
                  <img src="${item.img}" class="collection-img_img">
              </div>
              <div class="text-center">
                <div class="rating mt-3">
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                </div>
              <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
              <span class=" fw-bold d-block" style="font-size:15px;">${changeFormat(item.price)} VNĐ</span>
              </a>
              <button class="btn btn-primary mt-3 addToCart" data-product-id="1" onclick="handleAdd(${item.id});" style="font-size:15px;">Thêm vào giỏ hàng</button>
            </div>
        </div>`
      })
      collection_lists.innerHTML = htmls.join('')
      collection_lists.style.height = 'fit-content'
      jumpTo();
    })
}
function jumpTo() {
  var url = location.href;               //Saving URL without hash.
  location.href = "#product_name";                 //Navigate to the target element.
  history.replaceState(null, null, url);   //method modifies the current history entry.
}

//add to cart
function handleAdd(id) {
  var checkCook = getCookie("encryptedToken");
  if (checkCook == undefined || checkCook == "" || checkCook == "undefined") {
    alert("Bạn chưa đăng nhập !");
    document.location.href = "login.html";
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
          // var cartNumber= document.querySelector('#cartNumber')
          // cartNumbertext += 1
          // cartNumber.innerHTML='' + cartNumbertext
          renderCartView(tokenReal)
          alert('Thêm sản phẩm thành công');
          console.log(data);
        },
        error: function (msg) {
          alert(msg);
          console.log(msg);
        }
      });
    });

}
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
  var parent = document.querySelector(".cart-list");
  var cartNumber= document.querySelector('#cartNumber')
  var cartTittle = `
  <h4 class="text-dark" id="cart_view_tittle" style="font-weight:500; font-size: 16px;">Sản phẩm đã thêm</h4>
  `
  var cartViewProduct=`
  <div style="text-align:center;" id="cart_view_product">
  <a href="cart.html">
      <button class="cart-list_view m-2 text-dark checkout hidden">Xem giỏ hàng</button>
    </a>
  </div>
  `
  var html = "";
  if (array != undefined) {
    cartNumbertext = 0 
    html+= cartTittle; 
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
    cartNumber.innerHTML='' + cartNumbertext;
    html+= cartViewProduct; 
    parent.innerHTML = html;
  }
  else {
    cartNumber.innerHTML= '0';
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
function deleteProduct(id){
  fetch('http://127.0.0.1:8000/api/user/cart/destroy/'+ id, { 
    method: 'DELETE', 
    headers: new Headers({
        'Authorization': 'Bearer '+tokenReal,
        'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
  .then(data=>data.json())
  .then(data=>{
    if(data.success=='true' || data.success== true ){
      renderCartView(tokenReal)
      alert('Xóa sản phẩm thành công !')
      var item = document.getElementById(id)
      item.remove();
    }
    else{
      alert('Xóa sản phẩm không thành công !')
    }
  })
}

//special
$('.owl-carousel').owlCarousel({
  loop: true,
  nav: false,
  dots: true,
  responsive: {
    0: {
      items: 1
    },
    770: {
      items: 2
    },
    990: {
      items: 3
    },
    1200: {
      items: 4
    }
  }
})
