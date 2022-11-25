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
  function cartToggle() {
    const toggleMenu = document.querySelector('.cart-list');
    toggleMenu.classList.toggle('active')
  }
  var camItem = {
    "url": "",
    "data": []
  }

  //cart
  function handleAdd(id) {
    var checkCook = getCookie("encryptedToken");
    if (checkCook == undefined || checkCook == "" || checkCook == "undefined") {
      alert("Bạn chưa đăng nhập !");
      document.location.href = "http://127.0.0.1:5500/login.html";
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
            "quantity": getQuantity()
          },
          success: function (data) {
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
    fetch('http://127.0.0.1:8000/api/user/cart/state=all', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + tokenReal,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data)
        renderCartViewWithArray(data)
        console.log(data)
      })
  }
  var cartNumbertext = 0
  function renderCartViewWithArray(array) {
    var parent = document.querySelector(".cart-list");
    var cartNumber = document.querySelector('#cartNumber')
    var cartTittle = `
    <h4 class="text-dark" id="cart_view_tittle" style="font-weight:500; font-size: 16px;">Sản phẩm đã thêm</h4>
    <div class="scroller ">
    `
    var cartViewProduct = `
    </div>
    <div style="text-align:center;" id="cart_view_product">
    <a href="cart.html">
        <button class="cart-list_view m-2 text-dark checkout hidden">Xem giỏ hàng</button>
      </a>
    </div>
    
    `
    var html = "";
    console.log(typeof (array))

    if (array != undefined && array.errors == undefined) {
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
                            <h5 style="font-size:13px;font-weight:500; color:black;">${item.name}</h5>
                            <span id="sum-price" style="font-size: 10px;font-weight:500;color:black;">${changeFormat(item.price)} VNĐ&nbsp;&nbsp; x ${item.quantity}</span>
                        </div>
                        <div class="cart-item-body" style="display: flex; justify-content: space-between;">
                            <span style="font-size: 10px;color:black;">Phân loại: ${item.categories[0].name}</span>
                            <span class="cart-item-body_delete" onclick="deleteProduct(${item.id})"
                                style="font-size: 10px;font-weight: 800;color:black;">Xóa</span>
                        </div>
                    </div>
                </li>
            </ul>
            `
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
  function loadProductView(id) {
    const product_views = document.querySelector('.product_view')
    fetch('http://127.0.0.1:8000/api/products/' + id)
      .then(res => res.json())
      .then(data => {
        var kq = ` 
        <div class="col-sm-6" style="text-align:center;">
              <img src="${data.data.img}" alt="product" class="mt-5"style="width:45%;">
              <div class="form-row" style="margin-top:13%;">
                      <button type="submit" class="btn m-1 text-dark" onclick="handleAdd(${data.data.id});">Thêm vào giỏ hàng</button>
              </div>
          </div>
          <div class="col-sm-5  mt-5" style="border: 1px solid rgba(0, 0, 0, 0.2); padding:30px;border-radius:20px;">
              <h5 class="#" style="font-size:25px;">${data.data.name}</h5>
              <h6 class="#" style="font-weight:400;">Phân loại : ${data.data.categories[0].name}</h6>
              <div class="d-flex">
                  <div class="rating text-warning font-size-12 mb-2">
                      <span><i class="fas fa-star"></i></span>
                      <span><i class="fas fa-star"></i></span>
                      <span><i class="fas fa-star"></i></span>
                      <span><i class="fas fa-star"></i></span>
                      <span><i class="fas fa-star"></i></span>
                    </div>
                     <a href="#" class="px-2 text-dark" style="text-decoration:none;">20,534 đánh giá </a>
              </div>
              <hr class="m-1" style="color:rgba(0, 0, 0, 0.4); border:none; height:0.5px;">
                  <table class="my-3">
                      <tr class="font-rale font-size-14">
                          <td>Giá bán :</td>
                          <td class="font-size-20 text-danger"><span>&nbsp;&nbsp;${changeFormat(data.data.price)} VNĐ</td>
                      </tr>
                  </table>
              <hr class="m-1" style="color:rgba(0, 0, 0, 0.4); border:none; height:0.5px;">
              <div class="qty d-flex mt-3 mb-2">
                  <h6 class="font-baloo" style="margin-top:4px;">Số lượng</h6>
                  <div class="px-3 d-flex font-rale qty">
                      <button class="qty-up bg-light" data-id="${data.data.id}" style="border: 0.5px solid rgba(0,0,0,0.05);border-radius:6px 0px 0px 6px;"><i class="fa-solid fa-caret-up" style="font-size:12px;"></i></button>
                      <input id="input_quantity"type="text" data-id="${data.data.id}" class="qty_input border px-2 w-25 bg-light"style="text-align:center; "disabled value="1" placeholder="1">
                      <button data-id="${data.data.id}" class="qty-down bg-light" style="border: 0.5px solid rgba(0,0,0,0.05);border-radius:0px 6px 6px 0px;"><i class="fa-solid fa-caret-down" style="font-size:12px;"></i></button>
                  </div>
              </div>
                  <div id="policy">
                      <div class="d-flex mt-2 mb-3">
                          <div class="text-center"style="width: 33.3%;">
                              <div class="font-size-20 my-2 color-second">
                                  <span class="fas fa-retweet border p-3 rounded-pill"></span>
                              </div>
                              <a href="#" class="text-dark" style="text-decoration: none;">10 Ngày <br> Đổi trả</a>
                          </div>
                          <div class="text-center" style="width: 33.3%;">
                              <div class="font-size-20 my-2 color-second">
                                  <span class="fas fa-truck  border p-3 rounded-pill"></span>
                              </div>
                              <a href="#" class="text-dark" style="text-decoration: none;">Miễn Phí<br>Giao hàng</a>
                          </div>
                          <div class="text-center" style="width: 33.3%;">
                              <div class="font-size-15 my-2 color-second">
                                  <span class="fas fa-check-double border p-3 rounded-pill"></span>
                              </div>
                              <a href="#" class="text-dark" style="text-decoration:none;">2 Năm <br>Bảo hành</a>
                          </div>
                      </div>
                  </div>
                  <hr style="color:rgba(0, 0, 0, 0.4);border:none; height:0.5px;">
                  <div id="order-details" class="font-rale d-flex flex-column text-dark">
                      <small class="p-1"><i class="fa-brands fa-facebook"></i> <a href="#" class="text-dark"style="text-decoration: none;"> &nbsp;&nbsp;NP Camera </a></small>
                      <small class="p-1"><i class="fa-solid fa-phone"></i> &nbsp;&nbsp;0378774013</small>
                      <small class="p-1"> <i class="fas fa-map-marker-alt"></i> &nbsp;&nbsp; ĐIạ chỉ : 71/9 Nguyễn Văn Thương, P25, quận Bình Thạnh,TP Hồ Chí Mình</small>
                  </div>
          </div>

          <div class="col-12 py-5 mt-5">
              <h4 class="font-rubik">Mô tả sản phẩm</h4>
              <hr style="color:rgba(0, 0, 0, 0.4);border:none; height:0.5px;">
              <p class="font-rale font-size-14">${data.data.description}</p>
          </div>
      </div>`
        //var price= parseInt(item.price);
        //allItems.push({"price":price,"html":kq});
        console.log(product_views)
        product_views.innerHTML = kq
        console.log(product_views)
        assignButtonAddRemove();
        product_views.style.height = 'fit-content'
      }

      )
  }
  loadProductView()

  // user
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
    //console.log($qty_up2)
    let $qty_down = $(".qty .qty-down");
    // let $input = $(".qty .qty_input");

    // click on qty up button
    $qty_up.click(function (e) {
      let $input = $(`.qty_input[data-id='${$(this).data("id")}']`);
      if ($input.val() >= 1 && $input.val() <= 9) {
        $input.val(function (i, oldval) {
          return ++oldval;
        });
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
    });
  }
  function getQuantity() {
    var inputQuantity = document.getElementById('input_quantity');
    return inputQuantity.value.trim();
  }
  assignButtonAddRemove();

  //specials
  const specials_list = document.querySelector('.special-list')
  function loadProductSpecial() {
    fetch('http://127.0.0.1:8000/api/product/bestSeller', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + tokenReal,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .then(res => res.json())
      .then(data => {
        var htmls = "";
        console.log(data)
        for (const index in data) {
          var item = data[index];
          console.log(item)
          htmls += `
          <div class="p-5 col-lg-3 special-list_list">
              <a href="product.html?id=${item.productId}" style="text-decoration:none;">
                <div class="special-img">
                    <img src="${item.img}" class="special-img_img">
                </div>
                </a>
                <div class="text-center">
                    <div class="rating mt-2 mb-2">
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                    </div>
                    <p class="text-capitalize mt-1 mb-1" style="font-size:14px; color:black;">${item.name}</p>
                    <span class="fw-bold d-block" style="font-size: 14px;color:black;">${changeFormat(item.price)} VNĐ</span>
                    <button class="btn btn-primary mt-3 addToCart" data-product-id="1" onclick="handleAdd(${item.productId});"  style="font-size:15px;">Thêm vào giỏ hàng</button>
                </div>
          </div>`
        }
        specials_list.innerHTML = htmls
        specials_list.style.height = 'fit-content'
      })

  }
  loadProductSpecial();
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
}

