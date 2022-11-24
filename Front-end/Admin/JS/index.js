    //dashboard 
    function loadDashboard()
    {
    const dashboard_lists=document.querySelector('.dashboard_list')
    console.log(dashboard_lists)
    fetch('http://127.0.0.1:8000/api/admin/dashboard', { 
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer 3|G0VXUd9O5GeqiIuX3zUdM7ONpcNKOWK8AxjzUKHI',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
    .then(res=>res.json())
    .then(data=>{
        var count=0;
        var htmls = data.data.map((item)=>
        {
        return`
        <div class="col-lg-6 col-xl-6 ">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <h5 class="text-muted font-weight-normal mt-0 text-truncate" title="Campaign Sent">Sản phẩm</h5>
                                <h3 class="my-2 py-1">${item.totalProducts}</h3>
                                <p class="mb-0 text-muted">
                                    <span class="text-success mr-2"><i class="mdi mdi-arrow-up-bold"></i> 3.27%</span>
                                </p>
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
                                <h5 class="text-muted font-weight-normal mt-0 text-truncate" title="New Leads">Sale</h5>
                                <h3 class="my-2 py-1">${item.totalSales}</h3>
                                <p class="mb-0 text-muted">
                                    <span class="text-danger mr-2"><i class="mdi mdi-arrow-down-bold"></i> 5.38%</span>
                                </p>
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
                                <h5 class="text-muted font-weight-normal mt-0 text-truncate" title="Deals">Đơn hàng</h5>
                                <h3 class="my-2 py-1">${item.recentOrders}</h3>
                                <p class="mb-0 text-muted">
                                    <span class="text-success mr-2"><i class="mdi mdi-arrow-up-bold"></i> 11.87%</span>
                                </p>
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
                                <h5 class="text-muted font-weight-normal mt-0 text-truncate" title="Booked Revenue">Đơn hàng đang xử lí</h5>
                                <h3 class="my-2 py-1">${item.totalOrdersPending}</h3>
                                <p class="mb-0 text-muted">
                                    <span class="text-success mr-2"><i class="mdi mdi-arrow-up-bold"></i> 4.7%</span>
                                </p>
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

        })
        dashboard_lists.innerHTML=htmls.join('')
        dashboard_lists.style.height='fit-content'
    }
    
        )
    }
    loadDashboard()


    //product admin
    function loadProduct()
    {
    const product_lists=document.querySelector('.product_list')
    console.log(product_lists)
    fetch('http://127.0.0.1:8000/api/v1/products', { 
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer 5|W9XMDGYIOPj2gbo0S976rrz2Pv7J098hTIFN4gY1',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
    .then(res=>res.json())
    .then(data=>{
        var count=0;
        var htmls = data.data.map((item)=>
        {
        return`
        <tr>
            <td>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="${item.id}">
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
            <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
            <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>
        </td>
    </tr>`

        })
        product_lists.innerHTML=htmls.join('')
        product_lists.style.height='fit-content'
    }
    
        )
    }
    loadProduct()

    function changeFormat(price) {
        var numFloat = parseFloat(price);
        let number3 = numFloat.toLocaleString('vi-VN');
        return number3;
      }
      
    //user admin

    function loadUser()
    {
    const user_lists=document.querySelector('.user_list')
    console.log(user_lists)
    fetch('http://127.0.0.1:8000/api/v1/users', { 
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer 5|W9XMDGYIOPj2gbo0S976rrz2Pv7J098hTIFN4gY1',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    })
    .then(res=>res.json())
    .then(data=>{
        var count=0;
        var htmls = data.data.map((item)=>
        {
        return`
            <tr>
                <td>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="${item.id}">
                        <label class="custom-control-label" for="${item.id}">&nbsp;</label>
                    </div>
                </td>
                <td class="table-user">
                    <img src="${item.avatar!=null?item.avatar:item.defaultAvatar}" alt="table-user" class="mr-2 rounded-circle">
                    <a href="javascript:void(0);" class="text-body font-weight-semibold">${item.firstName} ${item.lastName}</a>
                </td>
                <td>
                    ${item.email}
                </td>
                <td>
                    ${item.createdAt}
                </td>
                <td>
                    <span class="badge badge-success-lighten">${item.disabled!=null?'Blocked':'Active'}</span>
                </td>

                <td style="width: 100px;">
                    <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                    <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>
                </td>
            </tr>`

        })
        user_lists.innerHTML=htmls.join('')
        user_lists.style.height='fit-content'
    }
    
        )
    }
    loadUser()

    //
    function getCookie(cname){
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
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
    function loadAdCate()
    {
    const toggleMenuList = document.querySelector('.menu_list');
    //   console.log(toggleMenuList);
    const toggleMenuDisplay =  document.querySelector('.menu_list ul');
    console.log(toggleMenuDisplay)
    //   toggleMenuList.classList.toggle('active')
    var token = 'encryptedToken'

    var checkCook=getCookie(token);
    if(checkCook==null||checkCook==""||checkCook==' undefined')
    {
        var htmls = function(){
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
        toggleMenuList.innerHTML=htmls();
        console.log(toggleMenuList);
    }
    else
    {
        var htmls = function(){
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
            <span > Đăng Xuất </span>
        </a>
    </li>`
    }
    toggleMenuList.innerHTML=htmls();
    }
    }
    loadAdCate()


    function handleLogout(){
        setCookie("encryptedToken",'',0);
        location.reload()  
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        
    }

