// init Isotope
var $grid = $('.collection-list').isotope({
    // options
  });
  // filter items on button click
  $('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    resetfilterBtns();
    $(this).addClass('active-filter-btn');
    $grid.isotope({ filter: filterValue });
  });

  var filterBtns = $('.filter-button-group').find('button');
  function resetfilterBtns()
    {
    filterBtns.each(function(){
      $(this).removeClass('active-filter-btn');
    });
  }

//search
//Getting all required element
const searchWrapper = document.querySelector(".search_input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

//if user press any key and release
inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
      emptyArray = suggestions.filter((data)=>{
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
      });
      emptyArray = emptyArray.map((data)=>{
        return data = '<li>'+ data +'</li>';
      });
      console.log(emptyArray);
      searchWrapper.classList.add("active"); //show autocomplete box
      showSuggestions(emptyArray);
      let allList = suggBox.querySelectorAll("li");
      for (let i = 0; i< allList.length; i++){  
          //adding onlick attribute in all li tag
          allList[i].setAttribute("onclick","select(this)");
      }
    }else{
      searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
  let selectUserData = element.textContent;
  inputBox.value = selectUserData // passing the user selected list item data in textfield 
  searchWrapper.classList.remove("active"); //hide autocomplete box
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    }else{
      listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function searchToggle(){
  const toggleSearch = document.querySelector('.wrapper');
  toggleSearch.classList.toggle('active')
}
//sort


// user
  function menuToggle(){
    const toggleMenu = document.querySelector('.action_menu');
    toggleMenu.classList.toggle('active')
  }