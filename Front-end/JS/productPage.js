// init IsotopecurrentURL
var currentURL = 'http://127.0.0.1:8000/api/products'
var currentURLAll = 'http://127.0.0.1:8000/api/products'
var currentURLCam = "http://127.0.0.1:8000/api/products/categories/1"
var currentURLongKinh = 'http://127.0.0.1:8000/api/products/categories/2'
var prelink = 'http://127.0.0.1:8000/api/products?orderBy=asc&page=';
var Currentdatalink={}
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

var sortUp = false;
var sortDown = false;
var itemsUp = null;
var itemsDown = null;
var allItems = [];
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

//product
const page_links = document.querySelectorAll('.page-link')
var page_link_1 = page_links[0];
var page_link_2 = page_links[1];
page_link_1.classList.add('active');
page_link_1.onclick = () => { handlePartPrev() };
page_link_2.onclick = () => { handlePartNext() };
function handlePartPrev() {
  if (Currentdatalink.prev_page_url == null) {
    page_link_1.classList.add('active');
    page_link_2.classList.remove('active');
  }
  else {
    currentURL = Currentdatalink.prev_page_url
    loadProductPage(currentURL)
  }
  //console.log(Currentdatalink[0].prev)
}
function handlePartNext() {
  console.log("Currentdatalink");
  console.log(Currentdatalink);
  if (Currentdatalink.next_page_url == null) {
    page_link_2.classList.add('active');
    page_link_1.classList.remove('active');
  }
  else {
    currentURL = Currentdatalink.next_page_url
    loadProductPage(currentURL)
  }
}
const container__sort = document.querySelector('.container__sort')
const container__sort_price = container__sort.children[3].children
const butAll = container__sort.children[0];
const butCam = container__sort.children[1];
const butLen = container__sort.children[2];
const butUp = container__sort_price[0]
const butDown = container__sort_price[1]

var currentURLOBJ;
var SanPhamTotal;
var SanPhamCurrent_page;
var SanPhamFrom;//int;
var SanPhamLast_page;
var SanPhamLinks //array;
var SanPhamPer_page //int;
var SanPhamTo;//int;
var begin;
var end;
function setBenginEndValue(data) {
  console.log("setBenginEndValue");
  begin = data.first[data.first.length - 1];
  end = data.last[data.last.length - 1];
}
function setBenginEndValue2(data) {
  console.log("setBenginEndValue");
  begin = data.first_page_url[data.first_page_url.length - 1];
  end = data.last_page_url[data.last_page_url.length - 1];
}
function loadProduct(currentURL, idcte) {
  var lanNayThemKhz = (camItem.url != undefined && camItem.url != "") ? false : true;
  console.log(currentURL);
  console.log("lanNayThemKhz", lanNayThemKhz);
  allItems = [];
  const collection_lists = document.querySelector('.collection-list')
  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      setBenginEndValue(data.links);
      console.log(data.meta)
      SanPhamLast_page = data.meta.last_page;
      SanPhamCurrent_page = data.meta.current_page;
      currentURLOBJ = data.links;
      var itemFilter = data.data.filter(item => item.deletedAt != 1)
      var htmls = itemFilter.map((item) => {
        var kq = ` 
        <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
              <a href="product.html?id=${item.id}" style="text-decoration:none;" class=" text-dark">
              <div class="collection-img">
                  <img src="${item.img}" class="collection-img_img">
              </div>
              <div class=" text-center">
                <div class="rating mt-3">
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                    <span class="text-primary"><i class="fas fa-star"></i></span>
                </div>
              <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
              <span class="d-block fw-bold"style="font-size:15px;"> ${changeFormat(item.price)} VNĐ</span>
              </a>
              <button class="btn btn-primary mt-3 addToCart" data-product-id="1"  style="font-size:15px;" onclick="handleAdd(${item.id});">Thêm vào giỏ hàng</button>
            </div>
        </div>`
        var price = parseInt(item.price);
        allItems.push({ "price": price, "html": kq });
        // if (lanNayThemKhz) {
        //   console.log("duoi " + parseInt(currentURL.substring(currentURL.length - 1, currentURL.length)));
        //   if (item.categories[0].id == 1) camItem.data.push({ "price": price, "html": kq });
        //   camItem.url = currentURL;
        // }
        //else
        // if (camItem.url.substring(camItem.url.length - 1, camItem.url.length) == "s" || (parseInt(camItem.url.substring(camItem.url.length - 1, camItem.url.length)) < parseInt(currentURL.substring(currentURL.length - 1, currentURL.length)))) {
        //   if (currentURL.substring(currentURL.length - 1, currentURL.length) != "s") {
        //     console.log("currentURL: "+currentURL)
        //     console.log("item.categories[0]: "+item.categories[0])
        //     if (item.categories.length>0&&item.categories[0].id == 1) {
        //       camItem.data.push({ "price": price, "html": kq });
        //     }
        //   } 

        // }
        return kq;
      })
      collection_lists.innerHTML = htmls.join('')
      collection_lists.style.height = 'fit-content'
      jumpTo();

      //Currentdatalink.push(data.links);
      // if (Currentdatalink.length == 2) {
      //   Currentdatalink.shift();
      // }
      console.log("heeheheheheh");
      var sanPhamUl = document.querySelector(".sanPhamUl");
      var ulHtml = '';
      console.log("SanPhamLast_page");
      console.log(SanPhamLast_page);
      for (var i = 1; i <= SanPhamLast_page; i++) {
        ulHtml += `<li id="PageNumber" style="display: inline-block ;padding:6px 8px 8px 8px;" class="page-item ${SanPhamCurrent_page == i ? 'active' : ''}" >
        ${i}
    </li>`
      }
      sanPhamUl.innerHTML = ulHtml;
      console.log(currentURLOBJ)
      console.log("sanPhamUl");
      console.log(sanPhamUl);
      const page_links = document.querySelectorAll('.page-link')
      var page_link_1 = page_links[0];
      var page_link_2 = page_links[1];
      page_link_1.classList.add('active');
      page_link_1.onclick = () => { handlePartPrev() };
      page_link_2.onclick = () => { handlePartNext() };
    }

    )
}
loadProductPage(currentURL)
function loadProductPage(currentURL, notJump,isPagaAll) {
  console.log("load")
  console.log(currentURL)
  var lanNayThemKhz = (camItem.url != undefined && camItem.url != "") ? false : true;
  console.log(currentURL);
  console.log("lanNayThemKhz", lanNayThemKhz);
  allItems = [];
  const collection_lists = document.querySelector('.collection-list')
  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      console.log("loadProductPage "+currentURL);
      console.log(data)
      SanPhamLast_page = data.last_page;
      SanPhamCurrent_page = data.current_page;
      currentURLOBJ = data.links;
      // var itemFilter=data.data.filter(item=>item.deletedAt!=1)
      var itemFilter = data.data;

      var htmls = "";
      for (const index in itemFilter) {
        var item = itemFilter[index];
        htmls += ` 
        <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
        <a href="product.html?id=${item.id}" style="text-decoration:none;" class=" text-dark">
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
      }

      //var price = parseInt(item.price);
      //allItems.push({ "price": price, "html": kq });
      // if (lanNayThemKhz) {
      //   console.log("duoi " + parseInt(currentURL.substring(currentURL.length - 1, currentURL.length)));
      //   if (item.categories[0].id == 1) camItem.data.push({ "price": price, "html": kq });
      //   camItem.url = currentURL;
      // }
      // else
      //   if (camItem.url.substring(camItem.url.length - 1, camItem.url.length) == "s" || (parseInt(camItem.url.substring(camItem.url.length - 1, camItem.url.length)) < parseInt(currentURL.substring(currentURL.length - 1, currentURL.length)))) {
      //     if (currentURL.substring(currentURL.length - 1, currentURL.length) != "s") {
      //       console.log("currentURL: " + currentURL)
      //       console.log("item.categories[0]: " + item.categories[0])
      //       if (item.categories.length > 0 && item.categories[0].id == 1) {
      //         camItem.data.push({ "price": price, "html": kq });
      //       }
      //     }

      //   }
      // return kq;

      collection_lists.innerHTML = htmls
      collection_lists.style.height = 'fit-content'
      if (!notJump) jumpTo();
      
      //console.
      if(data.hasOwnProperty('meta')){
         console.log("hasOwnProperty");
         console.log(data);
        Currentdatalink.next_page_url = data.links.next;
        Currentdatalink.path = data.meta.path;
        Currentdatalink.prev_page_url = data.links.prev;
      } else {
        setBenginEndValue2(data)
      Currentdatalink.next_page_url = data.next_page_url;
        Currentdatalink.path = data.path;
        Currentdatalink.prev_page_url = data.prev_page_url;
      }
      

      var sanPhamUl = document.querySelector(".sanPhamUl");
      var ulHtml = '';
      console.log("SanPhamLast_page");
      console.log(SanPhamLast_page);
      for (var i = 1; i <= SanPhamLast_page; i++) {
        ulHtml += `<li id="PageNumber" style="display: inline-block ;padding:6px 8px 8px 8px ;" class="page-item  ${SanPhamCurrent_page == i ? 'active' : ''}" >
        ${i}
    </li>`
      }
      sanPhamUl.innerHTML = ulHtml;
      console.log(currentURLOBJ)
      console.log("sanPhamUl");
      console.log(sanPhamUl);
      var page_link_1 = page_links[0];
      var page_link_2 = page_links[1];
      page_link_1.classList.add('active');
      page_link_1.onclick = () => { handlePartPrev() };
      page_link_2.onclick = () => { handlePartNext() };
    })

}
// function handlePartPrev(Currentdatalink) {
//   if (Currentdatalink[0].prev == null) {
//     page_link_1.classList.add('active');
//     page_link_2.classList.remove('active');
//   }
//   else {
//     currentURL = Currentdatalink[0].prev
//     loadProduct(currentURL)
//   }
//   console.log(Currentdatalink[0].prev)
// }
// function handlePartNext(Currentdatalink) {
//   if (Currentdatalink[0].next == null) {
//     page_link_2.classList.add('active');
//     page_link_1.classList.remove('active');
//   }
//   else {
//     currentURL = Currentdatalink[0].next
//     loadProduct(currentURL)
//   }
// }
function jumpTo() {
  var url = location.href;               //Saving URL without hash.
  location.href = "#product_name";                 //Navigate to the target element.
  history.replaceState(null, null, url);   //method modifies the current history entry.
}
var currentIndexUp = 0;
async function fetchUrl() {
  const collection_lists = document.querySelector('.collection-list')
  allItems = []
  itemsUp = [];
  for (var i = begin; i <= end; i++) {
    var curLink = prelink + i;
    await fetch(curLink)
      .then(res => res.json())
      .then(data => {
        //var itemFilter = data.data.filter(item => item.deletedAt != 1)
        var htmls = "";
        var itemFilter = data.data;
        for (var index in itemFilter) {
          var item = itemFilter[index];

          var kq = ` 
          <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
                <a href="product.html?id=${item.id}" style="text-decoration:none;" class=" text-dark">
                <div class="collection-img">
                    <img src="${item.img}" class="collection-img_img">
                </div>
                <div class=" text-center">
                  <div class="rating mt-3">
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                  </div>
                <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
                <span class="d-block fw-bold"style="font-size:15px;"> ${changeFormat(item.price)} VNĐ</span>
                </a>
                <button class="btn btn-primary mt-3 addToCart" data-product-id="1"  style="font-size:15px;" onclick="handleAdd(${item.id});">Thêm vào giỏ hàng</button>
              </div>
          </div>`
          htmls += kq
          console.log("response: " + curLink);
          var price = parseInt(item.price);
          itemsUp.push({ "price": price, "html": kq });
        }

      })
  }
  console.log("itemsUp.length");
  console.log(itemsUp.length);
  itemsUp.sort((a, b) => (a.price - b.price));
  var eachPage = 8;
  var html = "";
  var toIndex = itemsUp.length > eachPage ? eachPage : itemsUp.length;
  for (var k = 0; k < toIndex; k++) {
    html += itemsUp[k].html;

  }
  currentIndexUp = toIndex - 1;
  collection_lists.innerHTML = html;
  collection_lists.style.height = 'fit-content'
  jumpTo();
  //phan trang 
  // 8 cai 

  var length = itemsUp.length;
  var numPage;
  if (length % eachPage == 0) numPage = length / eachPage;
  else numPage = parseInt(length / eachPage) + 1;
  console.log("numPage" + numPage);
  var sanPhamUl = document.querySelector('.sanPhamUl');
  var ulHtml = '';
  for (var j = 1; j <= numPage; j++) {
    ulHtml += `<li id="PageNumber" style="display: inline-block ;padding:6px 8px 8px 8px;" onclick="handlePartUp(${j})"class="pt${j} page-item ${j == 1 ? ' active' : ''}">
  ${j}
</li>`
  }
  //alert("sanPhamUl"+ulHtml);
  sanPhamUl.innerHTML = ulHtml;


}
function handlePartUp(pageIndex) {
  console.log("handlePartUp " + pageIndex);
  const collection_lists = document.querySelector('.collection-list')
  var id = "pt" + pageIndex;
  var pageActive = document.querySelector('.' + id);
  var currentPage = document.querySelector('li.active');
  console.log(pageActive)
  console.log(currentPage)

  pageActive.classList.add('active');

  currentPage.classList.remove('active');
  var fromIndex = (pageIndex - 1) * 8;
  var toIndex = ((pageIndex * 8 - 1) > (itemsUp.length - 1)) ? itemsUp.length - 1 : (pageIndex * 8 - 1);
  console.log("render from item: " + fromIndex + "  to " + toIndex);
  var html = ''
  for (var k = fromIndex; k <= toIndex; k++) {
    html += itemsUp[k].html;
  }
  //currentIndexUp=toIndex;
  collection_lists.innerHTML = html;
}
butUp.onclick = () => {
  console.log("butUp");
  fetchUrl()
  //end for

  //asdasdasdasda
}
var currentIndexDown = 0;
async function fetchUrlDown() {
  const collection_lists = document.querySelector('.collection-list')
  allItems = []
  itemsDown = [];
  for (var i = begin; i <= end; i++) {
    var curLink = prelink + i;
    await fetch(curLink)
      .then(res => res.json())
      .then(data => {
        //var itemFilter = data.data.filter(item => item.deletedAt != 1)
        var htmls = "";
        var itemFilter = data.data;
        for (var index in itemFilter) {
          var item = itemFilter[index];

          var kq = ` 
          <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
                <a href="product.html?id=${item.id}" style="text-decoration:none;" class=" text-dark">
                <div class="collection-img">
                    <img src="${item.img}" class="collection-img_img">
                </div>
                <div class=" text-center">
                  <div class="rating mt-3">
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                      <span class="text-primary"><i class="fas fa-star"></i></span>
                  </div>
                <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
                <span class="d-block fw-bold"style="font-size:15px;"> ${changeFormat(item.price)} VNĐ</span>
                </a>
                <button class="btn btn-primary mt-3 addToCart" data-product-id="1"  style="font-size:15px;" onclick="handleAdd(${item.id});">Thêm vào giỏ hàng</button>
              </div>
          </div>`
          htmls += kq
          console.log("response: " + curLink);
          var price = parseInt(item.price);
          itemsDown.push({ "price": price, "html": kq });
        }

      })
  }
  console.log("itemsDown.length");
  console.log(itemsDown.length);
  itemsDown.sort((a, b) => (b.price - a.price));
  var eachPage = 8;
  var html = "";
  var toIndex = itemsDown.length > eachPage ? eachPage : itemsDown.length;
  for (var k = 0; k < toIndex; k++) {
    html += itemsDown[k].html;

  }
  currentIndexDown = toIndex - 1;
  collection_lists.innerHTML = html;
  collection_lists.style.height = 'fit-content'
  jumpTo();
  //phan trang 
  // 8 cai 

  var length = itemsDown.length;
  var numPage;
  if (length % eachPage == 0) numPage = length / eachPage;
  else numPage = parseInt(length / eachPage) + 1;
  console.log("numPage" + numPage);
  var sanPhamUl = document.querySelector('.sanPhamUl');
  var ulHtml = '';
  for (var j = 1; j <= numPage; j++) {
    ulHtml += `<li id="PageNumber" style="display: inline-block ;padding:6px 8px 8px 8px;" onclick="handlePartDown(${j})"class="pt${j} page-item ${j == 1 ? ' active' : ''}">
  ${j}
</li>`
  }
  //alert("sanPhamUl"+ulHtml);
  sanPhamUl.innerHTML = ulHtml;



}
function handlePartDown(pageIndex) {
  console.log("handlePartDown " + pageIndex);
  const collection_lists = document.querySelector('.collection-list')
  var id = "pt" + pageIndex;
  var pageActive = document.querySelector('.' + id);
  var currentPage = document.querySelector('li.active');
  console.log(pageActive)
  console.log(currentPage)

  pageActive.classList.add('active');

  currentPage.classList.remove('active');
  var fromIndex = (pageIndex - 1) * 8;
  var toIndex = ((pageIndex * 8 - 1) > (itemsDown.length - 1)) ? itemsDown.length - 1 : (pageIndex * 8 - 1);
  console.log("render from item: " + fromIndex + "  to " + toIndex);
  var html = ''
  for (var k = fromIndex; k <= toIndex; k++) {
    html += itemsDown[k].html;
  }
  //currentIndexUp=toIndex;
  collection_lists.innerHTML = html;
}
butDown.onclick = () => {
  console.log("butDown");
  fetchUrlDown()
}


butAll.onclick = () => {
  loadProductPage(currentURLAll)
}
butCam.onclick = () => {
  loadProductPage(currentURLCam);
}
function loadProductCam(currentURL) {
  const collection_lists = document.querySelector('.collection-list')
  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      console.log(data.meta)
      SanPhamLast_page = data.meta.last_page;
      SanPhamCurrent_page = data.meta.current_page;
      currentURLOBJ = data.links;
      var itemFilter = data.data.filter(item => item.deletedAt != 1)
      var htmls = itemFilter.map((item) => {
        var kq = ` 
      <div class="collection-list__list col-md-6 col-lg-4 col-xl-3 px-5 py-3">
            <a href="product.html?id=${item.id}" style="text-decoration:none;" class=" text-dark">
            <div class="collection-img">
                <img src="${item.img}" class="collection-img_img">
            </div>
            <div class=" text-center">
              <div class="rating mt-3">
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
                  <span class="text-primary"><i class="fas fa-star"></i></span>
              </div>
            <p class="text-capitalize my-1 product-name" style="font-size:15px;">${item.name}</p>
            <span class="d-block fw-bold"style="font-size:15px;"> ${changeFormat(item.price)} VNĐ</span>
            </a>
            <button class="btn btn-primary mt-3 addToCart" data-product-id="1"  style="font-size:15px;" onclick="handleAdd(${item.id});">Thêm vào giỏ hàng</button>
          </div>
      </div>`
        var price = parseInt(item.price);
        //allItems.push({ "price": price, "html": kq });
        return kq;
      })
      collection_lists.innerHTML = htmls.join('')
      collection_lists.style.height = 'fit-content'
      jumpTo();

      Currentdatalink=data.links;
      // if (Currentdatalink.length == 2) {
      //   Currentdatalink.shift();
      // }
      console.log("heeheheheheh");
      var sanPhamUl = document.querySelector(".sanPhamUl");
      var ulHtml = '';
      console.log("SanPhamLast_page");
      console.log(SanPhamLast_page);
      for (var i = 1; i <= SanPhamLast_page; i++) {
        ulHtml += `<li id="PageNumber" style="display: inline-block ;padding:6px 8px 8px 8px;" class="page-item ${SanPhamCurrent_page == i ? 'active' : ''}" >
      ${i}
  </li>`
      }
      sanPhamUl.innerHTML = ulHtml;
      console.log(currentURLOBJ)
      console.log("sanPhamUl");
      console.log(sanPhamUl);
    }

    )

  console.log(htmls);
}
butLen.onclick = () => {
  loadProductCam(currentURLongKinh);
}

//cart
function handleAdd(id) {
  var checkCook = getCookie("encryptedToken");
  if (checkCook == undefined || checkCook == "" || checkCook == "undefined") {
    alert("Bạn chưa đăng nhập !");
    document.location.href = "http://127.0.0.1:5500/login.html";
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

//specials
const specials_list = document.querySelector('.special-list')
console.log(specials_list)
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

